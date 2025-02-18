const core = require('@actions/core')
const github = require('@actions/github')
const { parse } = require('csv-parse/sync')
const semver = require('semver')

const Tags = require('./tags')

;(async () => {
    try {
        core.info('🏳️ Starting Update Version Tags Action')

        // Process Inputs
        const prefix = core.getInput('prefix')
        console.log('prefix:', prefix)
        const major = core.getBooleanInput('major')
        console.log('major:', major)
        const minor = core.getBooleanInput('minor')
        console.log('minor:', minor)
        const inputTags = core.getInput('tags')
        console.log('inputTags:', inputTags)
        const summary = core.getBooleanInput('summary')
        console.log('summary:', summary)
        const dry_run = core.getBooleanInput('dry_run')
        console.log('dry_run:', dry_run)
        const token = core.getInput('token', { required: true })
        // console.log('token:', token)

        // Check Tag
        if (!github.context.ref.startsWith('refs/tags/') && (major || minor)) {
            return core.notice(`Skipping event: ${github.context.eventName}`)
        }
        const tag = github.context.ref.replace('refs/tags/', '')
        core.info(`tag: \u001b[32;1m${tag}`)

        // Set Variables
        const { owner, repo } = github.context.repo
        console.log('owner:', owner)
        console.log('repo:', repo)
        const sha = github.context.sha
        core.info(`sha: \u001b[32;1m${sha}`)
        let parsed
        if (major || minor) {
            parsed = semver.parse(tag, {})
            console.log('parsed:', parsed)
            if (!parsed) {
                return core.setFailed(`Unable to parse ${tag} to a semver.`)
            }
        }

        core.info('⌛ Processing Tags')

        // Collect Tags
        const collectedTags = []
        if (inputTags) {
            const parsedTags = parse(inputTags, {
                delimiter: ',',
                trim: true,
                relax_column_count: true,
            }).flat()
            console.log('parsedTags:', parsedTags)
            collectedTags.push(...parsedTags)
        }
        if (major) {
            console.log(`Major Tag: ${prefix}${parsed.major}`)
            collectedTags.push(`${prefix}${parsed.major}`)
        }
        if (minor) {
            console.log(`Minor Tag: ${prefix}${parsed.major}.${parsed.minor}`)
            collectedTags.push(`${prefix}${parsed.major}.${parsed.minor}`)
        }
        console.log('collectedTags', collectedTags)
        if (!collectedTags.length) {
            return core.warning('No Tags to Process!')
        }
        const allTags = [...new Set(collectedTags)]
        console.log('allTags:', allTags)

        // Process Tags
        if (!dry_run) {
            const tags = new Tags(token, owner, repo)
            await processTags(tags, allTags, sha)
        } else {
            core.info('⏩ \u001b[33;1mDry Run Skipping Creation')
        }

        // Set Output
        core.info('📩 Setting Outputs')
        core.setOutput('tags', allTags.join(','))

        // Summary
        if (summary) {
            core.info('📝 Writing Job Summary')
            const inputs_table = inputsTable({
                prefix: prefix,
                major: major,
                minor: minor,
                tags: inputTags.replaceAll('\n', ','),
                summary: summary,
                dry_run: dry_run,
            })
            core.summary.addRaw('### Update Version Tags Action\n')
            // core.summary.addRaw('TODO: Add details about generated tags.\n')
            core.summary.addRaw(`Tags **${allTags.length}**\n`)
            core.summary.addCodeBlock(allTags.join('\n'), 'plain')
            core.summary.addRaw(inputs_table, true)
            core.summary.addRaw(
                '\n[View Documentation](https://github.com/cssnr/docker-tags-action?tab=readme-ov-file#readme) | '
            )
            core.summary.addRaw(
                '[Report an Issue or Request a Feature](https://github.com/cssnr/docker-tags-action/issues)'
            )
            await core.summary.write()
        } else {
            core.info('⏩ Skipping Job Summary')
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
 * TODO: Return results for summary
 */
async function processTags(tags, allTags, sha) {
    for (const tag of allTags) {
        core.info(`--- Processing tag: ${tag}`)
        const reference = await tags.getRef(tag)
        // console.log('reference?.data:', reference?.data)
        if (reference) {
            if (sha !== reference.data.object.sha) {
                core.info(`\u001b[32mUpdating tag "${tag}" to sha: ${sha}`)
                await tags.updateRef(tag, sha)
            } else {
                core.info(
                    `\u001b[36mTag "${tag}" already points to sha: ${sha}`
                )
            }
        } else {
            core.info(`\u001b[33mCreating new tag "${tag}" to sha: ${sha}`)
            await tags.createRef(tag, sha)
        }
    }
}

/**
 * @function inputsTable
 * @param {Object} inputs
 * @return String
 */
function inputsTable(inputs) {
    const table = [
        '<details><summary>Inputs</summary>',
        '<table><tr><th>Input</th><th>Value</th></tr>',
    ]
    for (const [key, object] of Object.entries(inputs)) {
        const value = object.toString() || '-'
        table.push(`<tr><td>${key}</td><td>${value}</td></tr>`)
    }
    return table.join('') + '</table></details>'
}
