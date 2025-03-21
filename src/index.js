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

        // Process Config
        const config = getConfig()
        core.startGroup('Parsed Config')
        console.log(config)
        core.endGroup() // Config

        const tags = new Tags(config.token, github.context.repo)

        // Set Tag - used to parse semver
        if (
            !github.context.ref.startsWith('refs/tags/') &&
            (config.major || config.minor) &&
            !config.tag
        ) {
            return core.notice(`Skipping event: ${github.context.eventName}`)
        }
        const tag = config.tag || github.context.ref.replace('refs/tags/', '')
        core.info(`Target tag: \u001b[32m${tag}`)

        // Set Sha - target sha for allTags
        let sha = github.context.sha
        if (config.tag) {
            core.info(`Getting sha for ref: \u001b[33m${config.tag}`)
            const ref = await tags.getRef(config.tag)
            // console.log('ref:', ref)
            if (!ref) {
                return core.setFailed(`Ref not found: ${config.tag}`)
            }
            sha = ref.data.object.sha
        }
        core.info(`Target sha: \u001b[32m${sha}`)

        // Set SemVer - if major or minor is true
        let parsed
        if (config.major || config.minor) {
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
        if (config.tags) {
            const parsedTags = parse(config.tags, {
                delimiter: ',',
                trim: true,
                relax_column_count: true,
            }).flat()
            console.log('parsedTags:', parsedTags)
            collectedTags.push(...parsedTags)
        }
        if (config.major) {
            console.log(`Major Tag: ${config.prefix}${parsed.major}`)
            collectedTags.push(`${config.prefix}${parsed.major}`)
        }
        if (config.minor) {
            console.log(
                `Minor Tag: ${config.prefix}${parsed.major}.${parsed.minor}`
            )
            collectedTags.push(
                `${config.prefix}${parsed.major}.${parsed.minor}`
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
        if (!config.dry_run) {
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

        // Summary
        if (config.summary) {
            core.info('📝 Writing Job Summary')
            try {
                await addSummary(config, tag, sha, results, parsed, allTags)
            } catch (e) {
                console.log(e)
                core.error(`Error writing Job Summary ${e.message}`)
            }
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
 * @param {Config} config
 * @param {String} tag
 * @param {String} sha
 * @param {Object} results
 * @param {String} parsed
 * @param {String[]} allTags
 * @return {Promise<void>}
 */
async function addSummary(config, tag, sha, results, parsed, allTags) {
    core.summary.addRaw('## Update Version Tags Action\n')

    if (config.dry_run) {
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

    delete config.token
    const yaml = Object.entries(config)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
        .join('\n')
    core.summary.addRaw('<details><summary>Config</summary>')
    core.summary.addCodeBlock(yaml, 'yaml')
    core.summary.addRaw('</details>\n')

    const text = 'View Documentation, Report Issues or Request Features'
    const link = 'https://github.com/cssnr/update-version-tags-action'
    core.summary.addRaw(`\n[${text}](${link}?tab=readme-ov-file#readme)\n\n---`)
    await core.summary.write()
}

/**
 * Get Config
 * @typedef {Object} Config
 * @property {String} prefix
 * @property {Boolean} major
 * @property {Boolean} minor
 * @property {String} tags
 * @property {String} tag
 * @property {Boolean} summary
 * @property {Boolean} dry_run
 * @property {String} token
 * @return {Config}
 */
function getConfig() {
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
