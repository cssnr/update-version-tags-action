const github = require('@actions/github')

class Tags {
    /**
     * Create Tags instance
     * @param {string} token - github.token
     * @param {{ owner: string, repo: string }} repo - github.context.repo
     */
    constructor(token, repo) {
        this.owner = repo.owner
        this.repo = repo.repo
        this.octokit = github.getOctokit(token)
    }

    /**
     * Get ref by tag
     * @param {string} tag
     * @return {Promise<object|null>}
     */
    async getRef(tag) {
        try {
            return await this.octokit.rest.git.getRef({
                owner: this.owner,
                repo: this.repo,
                ref: `tags/${tag}`,
            })
        } catch (e) {
            if (e.status === 404) {
                return null
            }
            throw new Error(e)
        }
    }

    /**
     * Create tag to sha
     * @param {string} tag
     * @param {string} sha
     * @return {Promise<object>}
     */
    async createRef(tag, sha) {
        return await this.octokit.rest.git.createRef({
            owner: this.owner,
            repo: this.repo,
            ref: `refs/tags/${tag}`,
            sha,
        })
    }

    /**
     * Update tag to sha
     * @param {string} tag
     * @param {string} sha
     * @return {Promise<object>}
     */
    async updateRef(tag, sha) {
        await this.octokit.rest.git.updateRef({
            owner: this.owner,
            repo: this.repo,
            ref: `tags/${tag}`,
            sha,
        })
    }
}

module.exports = Tags
