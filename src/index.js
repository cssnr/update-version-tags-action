const core = require('@actions/core')
const github = require('@actions/github')
const semver = require('semver')
const { parse } = require('csv-parse/sync')

;(async () => {
    try {
        // Check Tag
        if (!github.context.ref.startsWith('refs/tags/')) {
            core.notice(`Skipping due to non-tags: ${github.context.ref}`)
            return
        }
        const tag = github.context.ref.replace('refs/tags/', '')
        console.log('tag:', tag)

        // Process Inputs
        const token = core.getInput('token', { required: true })
        // console.log('token:', token)
        const prefix = core.getInput('prefix')
        console.log('prefix:', prefix)
        const major = core.getBooleanInput('major')
        console.log('major:', major)
        const minor = core.getBooleanInput('minor')
        console.log('minor:', minor)
        const tags = core.getInput('tags')
        console.log('tags:', tags)

        // Set Variables
        const { owner, repo } = github.context.repo
        console.log('owner:', owner)
        console.log('repo:', repo)
        const sha = github.context.sha
        console.log('sha:', sha)
        const majorVer = semver.major(tag)
        console.log('majorVer:', majorVer)
        const minorVer = semver.minor(tag)
        console.log('minorVer:', minorVer)

        // Collect Tags
        const collectedTags = []
        if (tags) {
            const parsedTags = parse(tags, {
                delimiter: ',',
                trim: true,
                relax_column_count: true,
            }).flat()
            console.log('parsedTags:', parsedTags)
            collectedTags.push(...parsedTags)
        }
        if (major) {
            console.log(`Major Tag: ${prefix}${majorVer}`)
            collectedTags.push(`${prefix}${majorVer}`)
        }
        if (minor) {
            console.log(`Minor Tag: ${prefix}${majorVer}.${minorVer}`)
            collectedTags.push(`${prefix}${majorVer}.${minorVer}`)
        }
        console.log('collectedTags', collectedTags)
        if (!collectedTags.length) {
            return core.warning('No Tags to Process!')
        }
        const allTags = [...new Set(collectedTags)]
        console.log('allTags:', allTags)

        // Process Tags
        const octokit = github.getOctokit(token)
        for (const tag of allTags) {
            core.info(`----- Processing tag: ${tag} -----`)
            // Note: Some endpoints use tags/tag and others use refs/tags/tag
            const ref = `tags/${tag}`
            console.log('ref:', ref)
            const reference = await getRef(octokit, owner, repo, ref)
            // console.log('reference.data:', reference.data)
            if (reference) {
                if (sha !== reference.data.object.sha) {
                    core.info(`Updating tag "${tag}" to sha ${sha}`)
                    await updateRef(octokit, owner, repo, ref, sha)
                } else {
                    core.info(`Tag "${tag}" already points to sha ${sha}`)
                }
            } else {
                core.info(`Creating new tag "${tag}" to sha ${sha}`)
                await createRef(octokit, owner, repo, ref, sha)
            }
        }
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()

async function getRef(octokit, owner, repo, ref) {
    try {
        return await octokit.rest.git.getRef({
            owner,
            repo,
            ref,
        })
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        return null
    }
}

async function createRef(octokit, owner, repo, ref, sha) {
    try {
        return await octokit.rest.git.createRef({
            owner,
            repo,
            ref: `refs/${ref}`,
            sha,
        })
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.error(`Failed to create tag: ${ref}`)
    }
}

async function updateRef(octokit, owner, repo, ref, sha) {
    try {
        await octokit.rest.git.updateRef({
            owner,
            repo,
            ref,
            sha,
        })
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.error(`Failed to update tag: ${ref}`)
    }
}
