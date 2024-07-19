const core = require('@actions/core')
const github = require('@actions/github')
const semver = require('semver')
const { parse } = require('csv-parse/sync')

const Tags = require('./tags')

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
        const inputTags = core.getInput('tags')
        console.log('inputTags:', inputTags)

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
        const tags = new Tags(token, owner, repo)
        for (const tag of allTags) {
            core.info(`--- Processing tag: ${tag}`)
            const reference = await tags.getRef(tag)
            // console.log('reference?.data:', reference?.data)
            if (reference) {
                if (sha !== reference.data.object.sha) {
                    core.info(`Updating tag "${tag}" to sha ${sha}`)
                    await tags.updateRef(tag, sha)
                } else {
                    core.info(`Tag "${tag}" already points to sha ${sha}`)
                }
            } else {
                core.info(`Creating new tag "${tag}" to sha ${sha}`)
                await tags.createRef(tag, sha)
            }
        }

        // Set Output
        core.setOutput('tags', allTags.join(','))
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()
