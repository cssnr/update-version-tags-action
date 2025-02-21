const core = require('@actions/core')
const github = require('@actions/github')
const { parse } = require('csv-parse/sync')
const semver = require('semver')

const Tags = require('./tags')

;(async () => {
    try {
        core.info('🏳️ Starting Update Version Tags Action')

        // Process Inputs
        const inputs = parseInputs()
        core.startGroup('Parse Inputs')
        console.log(inputs)
        core.endGroup() // Inputs

        // Check Tag
        if (
            !github.context.ref.startsWith('refs/tags/') &&
            (inputs.major || inputs.minor)
        ) {
            return core.notice(`Skipping event: ${github.context.eventName}`)
        }
        const tag = github.context.ref.replace('refs/tags/', '')
        core.info(`tag: \u001b[32;1m${tag}`)

        // Set Variables
        const { owner, repo } = github.context.repo
        // console.log('owner:', owner)
        // console.log('repo:', repo)
        const sha = github.context.sha
        core.info(`sha: \u001b[32;1m${sha}`)
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

        // Collect Tags
        // core.info('⌛ Processing Tags')
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
        console.log('allTags:', allTags)

        // Process Tags
        /** @type {Object} */
        let results
        if (!inputs.dry_run) {
            const tags = new Tags(inputs.token, owner, repo)
            results = await processTags(tags, allTags, sha)
        } else {
            core.info('⏩ \u001b[33;1mDry Run Skipping Creation')
        }

        // Set Output
        core.info('📩 Setting Outputs')
        core.setOutput('tags', allTags.join(','))

        // Job Summary
        if (inputs.summary) {
            core.info('📝 Writing Job Summary')
            await writeSummary(inputs, sha, results, parsed, allTags)
        }

        core.info('✅ \u001b[32;1mFinished Success')
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()

/**
 * @function processTags
 * @param {Tags} tags
 * @param {String[]} allTags
 * @param {String} sha
 * @return {Object}
 */
async function processTags(tags, allTags, sha) {
    const results = {}
    for (const tag of allTags) {
        core.info(`--- Processing tag: ${tag}`)
        const reference = await tags.getRef(tag)
        // console.log('reference?.data:', reference?.data)
        if (reference) {
            if (sha !== reference.data.object.sha) {
                core.info(`\u001b[32mUpdating tag "${tag}" to sha: ${sha}`)
                await tags.updateRef(tag, sha)
                results[tag] = 'Updated'
            } else {
                core.info(
                    `\u001b[36mTag "${tag}" already points to sha: ${sha}`
                )
                results[tag] = 'Unchanged'
            }
        } else {
            core.info(`\u001b[33mCreating new tag "${tag}" to sha: ${sha}`)
            await tags.createRef(tag, sha)
            results[tag] = 'Created'
        }
    }
    return results
}

/**
 * @function parseInputs
 * @return {{
 *   prefix: string,
 *   major: boolean,
 *   minor: boolean,
 *   tags: string,
 *   summary: boolean,
 *   dry_run: boolean,
 *   token: string
 * }}
 */
function parseInputs() {
    return {
        prefix: core.getInput('prefix'),
        major: core.getBooleanInput('major'),
        minor: core.getBooleanInput('minor'),
        tags: core.getInput('tags'),
        summary: core.getBooleanInput('summary'),
        dry_run: core.getBooleanInput('dry_run'),
        token: core.getInput('token', { required: true }),
    }
}

/**
 * @function writeSummary
 * @param {Object} inputs
 * @param {String} sha
 * @param {Object} results
 * @param {String} parsed
 * @param {Array} allTags
 * @return {Promise<void>}
 */
async function writeSummary(inputs, sha, results, parsed, allTags) {
    core.summary.addRaw('## Update Version Tags Action\n')
    core.summary.addRaw(`sha: \`${sha}\`\n\n`)

    if (inputs.dry_run) {
        core.summary.addRaw('⚠️ Dry Run! Nothing changed.\n\n')
    }

    core.summary.addRaw(`**Tags:**\n`)
    core.summary.addCodeBlock(allTags.join('\n'), 'text')

    if (results) {
        const results_table = []
        for (const [key, object] of Object.entries(results)) {
            results_table.push([
                { data: key },
                { data: `<code>${object.toString() || '-'}</code>` },
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

    // core.summary.addRaw(inputs_table, true)
    core.summary.addRaw('<details><summary>Inputs</summary>')
    core.summary.addTable([
        [
            { data: 'Input', header: true },
            { data: 'Value', header: true },
        ],
        [{ data: 'prefix' }, { data: `<code>${inputs.prefix}</code>` }],
        [{ data: 'major' }, { data: `<code>${inputs.major}</code>` }],
        [{ data: 'minor' }, { data: `<code>${inputs.minor}</code>` }],
        [
            { data: 'tags' },
            { data: `<code>${inputs.tags.replaceAll('\n', ',')}</code>` },
        ],
        [{ data: 'summary' }, { data: `<code>${inputs.summary}</code>` }],
        [{ data: 'dry_run' }, { data: `<code>${inputs.dry_run}</code>` }],
    ])
    core.summary.addRaw('</details>\n')

    const text = 'View Documentation, Report Issues or Request Features'
    const link = 'https://github.com/cssnr/update-version-tags-action'
    core.summary.addRaw(`\n[${text}](${link}?tab=readme-ov-file#readme)\n\n---`)
    await core.summary.write()
}
