const core = require('@actions/core')
const github = require('@actions/github')
const { parse } = require('csv-parse/sync')
const semver = require('semver')

const Tags = require('./tags')

;(async () => {
    try {
        const version = process.env.GITHUB_ACTION_REF
            ? `\u001b[35;1m${process.env.GITHUB_ACTION_REF}`
            : '\u001b[34;1mLocal Version'
        core.info(`🏳️ Starting Update Version Tags Action - ${version}`)

        // Process Inputs
        const inputs = parseInputs()
        core.startGroup('Parsed Inputs')
        console.log(inputs)
        core.endGroup() // Inputs

        const tags = new Tags(inputs.token, github.context.repo)

        // Set Tag - used to parse semver
        if (
            !github.context.ref.startsWith('refs/tags/') &&
            (inputs.major || inputs.minor) &&
            !inputs.tag
        ) {
            return core.notice(`Skipping event: ${github.context.eventName}`)
        }
        const tag = inputs.tag || github.context.ref.replace('refs/tags/', '')
        core.info(`Target tag: \u001b[32m${tag}`)

        // Set Sha - target sha for allTags
        let sha = github.context.sha
        if (inputs.tag) {
            core.info(`Getting sha for ref: \u001b[33m${inputs.tag}`)
            const ref = await tags.getRef(inputs.tag)
            // console.log('ref:', ref)
            if (!ref) {
                return core.setFailed(`Ref not found: ${inputs.tag}`)
            }
            sha = ref.data.object.sha
        }
        core.info(`Target sha: \u001b[32m${sha}`)

        // Set SemVer - if major or minor is true
        let parsed
        if (inputs.major || inputs.minor) {
            core.startGroup('Parsed SemVer')
            parsed = semver.parse(tag, {})
            console.log(parsed)
            core.endGroup() // SemVer
            if (!parsed) {
                return core.setFailed(`Unable to parse ${tag} to a semver.`)
            }
        }

        // Collect Tags - allTags
        core.startGroup('Processing Tags')
        const collectedTags = []
        if (inputs.tags) {
            const parsedTags = parse(inputs.tags, {
                delimiter: ',',
                trim: true,
                relax_column_count: true,
            }).flat()
            console.log('parsedTags:', parsedTags)
            collectedTags.push(...parsedTags)
        }
        if (inputs.major) {
            console.log(`Major Tag: ${inputs.prefix}${parsed.major}`)
            collectedTags.push(`${inputs.prefix}${parsed.major}`)
        }
        if (inputs.minor) {
            console.log(
                `Minor Tag: ${inputs.prefix}${parsed.major}.${parsed.minor}`
            )
            collectedTags.push(
                `${inputs.prefix}${parsed.major}.${parsed.minor}`
            )
        }
        console.log('collectedTags', collectedTags)
        if (!collectedTags.length) {
            return core.warning('No Tags to Process!')
        }
        core.endGroup() // Processing

        const allTags = [...new Set(collectedTags)]
        console.log('Tags:', allTags)

        // Process Tags
        /** @type {Object} */
        let results
        if (!inputs.dry_run) {
            results = await processTags(tags, allTags, sha)

            core.startGroup('Results')
            console.log(results)
            core.endGroup() // Results
        } else {
            core.info('⏩ \u001b[33;1mDry Run Skipping Creation')
        }

        // Set Output
        core.info('📩 Setting Outputs')
        core.setOutput('tags', allTags.join(','))

        // Job Summary
        if (inputs.summary) {
            core.info('📝 Writing Job Summary')
            await writeSummary(inputs, tag, sha, results, parsed, allTags)
        }

        core.info('✅ \u001b[32;1mFinished Success')
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()

/**
 * Process Tags
 * @param {Tags} tags
 * @param {String[]} allTags
 * @param {String} sha
 * @return {Object}
 */
async function processTags(tags, allTags, sha) {
    const results = {}
    for (const tag of allTags) {
        // core.info(`Processing tag: \u001b[36m${tag}`)
        core.startGroup(`Processing tag: \u001b[36m${tag}`)
        const reference = await tags.getRef(tag)
        // console.log('reference:', reference)
        if (reference) {
            core.info(`Current:    ${reference.data.object.sha}`)
            if (sha !== reference.data.object.sha) {
                // core.info(`\u001b[32mUpdating tag "${tag}" to sha: ${sha}`)
                await tags.updateRef(tag, sha)
                core.info(`Updated:    ${sha}`)
                results[tag] = 'Updated'
            } else {
                // core.info(`\u001b[35mTag "${tag}" already points to sha: ${sha}`)
                core.info(`No Change:  ${sha}`)
                results[tag] = 'No Change'
            }
        } else {
            // core.info(`\u001b[33mCreating new tag "${tag}" to sha: ${sha}`)
            core.info(`Tag not found...`)
            await tags.createRef(tag, sha)
            results[tag] = 'Created'
            core.info(`Creating:   ${sha}`)
        }
        core.endGroup() // Tag
    }
    return results
}

/**
 * Write Job Summary
 * @param {Object} inputs
 * @param {String} tag
 * @param {String} sha
 * @param {Object} results
 * @param {String} parsed
 * @param {Array} allTags
 * @return {Promise<void>}
 */
async function writeSummary(inputs, tag, sha, results, parsed, allTags) {
    core.summary.addRaw('## Update Version Tags Action\n')

    if (inputs.dry_run) {
        core.summary.addRaw('⚠️ Dry Run! Nothing changed.\n\n')
    }

    core.summary.addTable([
        [{ data: 'Tag' }, { data: `<code>${tag}</code>` }],
        [{ data: 'Sha' }, { data: `<code>${sha}</code>` }],
        [{ data: 'Tags' }, { data: `<code>${allTags.join(',')}</code>` }],
    ])

    core.summary.addRaw('<details><summary><strong>Tags</strong></summary>\n\n')
    core.summary.addCodeBlock(allTags.join('\n'), 'text')
    core.summary.addRaw('</details>\n')

    if (results) {
        const results_table = []
        for (const [key, object] of Object.entries(results)) {
            results_table.push([
                { data: `<code>${key}</code>` },
                { data: object.toString() || 'Report as Bug' },
            ])
        }
        core.summary.addRaw('<details><summary>Results</summary>')
        core.summary.addTable([
            [
                { data: 'Tag', header: true },
                { data: 'Result', header: true },
            ],
            ...results_table,
        ])
        core.summary.addRaw('</details>\n')
    }

    if (parsed) {
        core.summary.addDetails(
            '<strong>SemVer</strong>',
            `\n\n\`\`\`json\n${JSON.stringify(parsed, null, 2)}\n\`\`\`\n\n`
        )
    }

    // inputs.token = '***'
    delete inputs.token
    const yaml = Object.entries(inputs)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
        .join('\n')

    // core.summary.addRaw('<details><summary>Inputs</summary>')
    // core.summary.addTable([
    //     [
    //         { data: 'Input', header: true },
    //         { data: 'Value', header: true },
    //     ],
    //     [{ data: 'prefix' }, { data: `<code>${inputs.prefix}</code>` }],
    //     [{ data: 'major' }, { data: `<code>${inputs.major}</code>` }],
    //     [{ data: 'minor' }, { data: `<code>${inputs.minor}</code>` }],
    //     [
    //         { data: 'tags' },
    //         { data: `<code>${inputs.tags.replaceAll('\n', ',')}</code>` },
    //     ],
    //     [{ data: 'summary' }, { data: `<code>${inputs.summary}</code>` }],
    //     [{ data: 'dry_run' }, { data: `<code>${inputs.dry_run}</code>` }],
    // ])
    // core.summary.addRaw('</details>\n')
    core.summary.addRaw('<details><summary>Inputs</summary>')
    core.summary.addCodeBlock(yaml, 'yaml')
    core.summary.addRaw('</details>\n')

    const text = 'View Documentation, Report Issues or Request Features'
    const link = 'https://github.com/cssnr/update-version-tags-action'
    core.summary.addRaw(`\n[${text}](${link}?tab=readme-ov-file#readme)\n\n---`)
    await core.summary.write()
}

/**
 * Get inputs
 * @return {{prefix: string, major: boolean, minor: boolean, tags: string, tag: string, summary: boolean, dry_run: boolean, token: string}}
 */
function parseInputs() {
    return {
        prefix: core.getInput('prefix'),
        major: core.getBooleanInput('major'),
        minor: core.getBooleanInput('minor'),
        tags: core.getInput('tags'),
        tag: core.getInput('tag'),
        summary: core.getBooleanInput('summary'),
        dry_run: core.getBooleanInput('dry_run'),
        token: core.getInput('token', { required: true }),
    }
}
