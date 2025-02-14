const core = require('@actions/core')
const github = require('@actions/github')
const { parse } = require('csv-parse/sync')
const semver = require('semver')

const Tags = require('./tags')

;(async () => {
    try {
        // Process Inputs
        const prefix = core.getInput('prefix')
        console.log('prefix:', prefix)
        const major = core.getBooleanInput('major')
        console.log('major:', major)
        const minor = core.getBooleanInput('minor')
        console.log('minor:', minor)
        const inputTags = core.getInput('tags')
        console.log('inputTags:', inputTags)
        const write = core.getBooleanInput('write')
        console.log('write:', write)
        const token = core.getInput('token', { required: true })
        // console.log('token:', token)

        // Check Tag
        if (!github.context.ref.startsWith('refs/tags/') && (major || minor)) {
            core.notice(`Skipping due to non-tags: ${github.context.ref}`)
            return
        }
        const tag = github.context.ref.replace('refs/tags/', '')
        console.log('tag:', tag)

        // Set Variables
        const { owner, repo } = github.context.repo
        console.log('owner:', owner)
        console.log('repo:', repo)
        const sha = github.context.sha
        console.log('sha:', sha)
        let parsed
        if (major || minor) {
            parsed = semver.parse(tag, {})
            console.log('parsed:', parsed)
            if (!parsed) {
                return core.setFailed(`Unable to parse ${tag} to a semver.`)
            }
        }

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
        if (write) {
            const tags = new Tags(token, owner, repo)
            await processTags(tags, allTags, sha)
        }

        // Set Output
        core.setOutput('tags', allTags.join(','))

        core.info(`✅ \u001b[32;1mFinished Success`)
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()

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
