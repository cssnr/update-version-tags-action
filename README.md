[![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&filter=!v*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/update-version-tags-action/tags)
[![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&filter=!v*.*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/update-version-tags-action/releases)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/update-version-tags-action?logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/update-version-tags-action/releases/latest)
[![GitHub Dist Size](https://img.shields.io/github/size/cssnr/update-version-tags-action/dist%2Findex.js?logo=bookstack&logoColor=white&label=dist%20size)](https://github.com/cssnr/update-version-tags-action/blob/master/src)
[![Workflow Release](https://img.shields.io/github/actions/workflow/status/cssnr/update-version-tags-action/release.yaml?logo=cachet&label=release)](https://github.com/cssnr/update-version-tags-action/actions/workflows/release.yaml)
[![Workflow Test](https://img.shields.io/github/actions/workflow/status/cssnr/update-version-tags-action/test.yaml?logo=cachet&label=test)](https://github.com/cssnr/update-version-tags-action/actions/workflows/test.yaml)
[![Workflow Lint](https://img.shields.io/github/actions/workflow/status/cssnr/update-version-tags-action/lint.yaml?logo=cachet&label=lint)](https://github.com/cssnr/update-version-tags-action/actions/workflows/lint.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_update-version-tags-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_update-version-tags-action)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/update-version-tags-action?logo=github&label=updated)](https://github.com/cssnr/update-version-tags-action/pulse)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/cssnr/update-version-tags-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/cssnr/update-version-tags-action)
[![GitHub Contributors](https://img.shields.io/github/contributors-anon/cssnr/update-version-tags-action?logo=github)](https://github.com/cssnr/update-version-tags-action/graphs/contributors)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/cssnr/update-version-tags-action?logo=bookstack&logoColor=white&label=repo%20size)](https://github.com/cssnr/update-version-tags-action?tab=readme-ov-file#readme)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/update-version-tags-action?logo=htmx)](https://github.com/cssnr/update-version-tags-action)
[![GitHub Discussions](https://img.shields.io/github/discussions/cssnr/update-version-tags-action?logo=github)](https://github.com/cssnr/update-version-tags-action/discussions)
[![GitHub Forks](https://img.shields.io/github/forks/cssnr/update-version-tags-action?style=flat&logo=github)](https://github.com/cssnr/update-version-tags-action/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/cssnr/update-version-tags-action?style=flat&logo=github)](https://github.com/cssnr/update-version-tags-action/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-72a5f2?logo=kofi&label=support)](https://ko-fi.com/cssnr)

# Update Version Tags Action

- [Inputs](#Inputs)
  - [Permissions](#Permissions)
- [Outputs](#Outputs)
- [Examples](#Examples)
  - [Rolling Back](#rolling-back)
- [Tags](#Tags)
- [Badges](#Badges)
- [Support](#Support)
- [Contributing](#Contributing)

Update Version Tags on Push or Release for Semantic Versions or Custom Tags.

Zero configuration to maintain both major `vN` -> `vN.x.x` and minor `vN.N` -> `vN.N.x` tags.

This is useful if you want to automatically update additional tags, to point to your pushed/released tag.
For example, many GitHub Actions maintain a `vN` and `vN.N` tag that points to the latest release of the `vN.x.x` branch.

```yaml
- name: 'Update Tags'
  uses: cssnr/update-version-tags-action@v1
```

GitHub Actions can copy and paste this workflow: [release.yaml](.github/workflows/release.yaml)

Make sure to review the [Inputs](#inputs) and checkout more [Examples](#examples).

For more details see [src/index.js](src/index.js) and [action.yml](action.yml).

> [!NOTE]  
> Please submit a [Feature Request](https://github.com/cssnr/update-version-tags-action/discussions/categories/feature-requests)
> for new features or [Open an Issue](https://github.com/cssnr/update-version-tags-action/issues) if you find any bugs.

## Inputs

| Input                | Default&nbsp;Value | Description&nbsp;of&nbsp;Input   |
| :------------------- | :----------------- | :------------------------------- |
| [prefix](#prefix)    | `v`                | Tag Prefix for Semantic Versions |
| [major](#majorminor) | `true`             | Update Major Tag                 |
| [minor](#majorminor) | `true`             | Update Minor Tag                 |
| [tags](#tags)        | -                  | Additional Tags to Update        |
| [tag](#tag)          | `github.ref_name`  | Manually Set Target Tag          |
| [create](#create)    | `false`            | Create Target Tag                |
| [summary](#summary)  | `true`             | Add Summary to Job               |
| [dry_run](#dry_run)  | `false`            | Do not Create Tags, Outout Only  |
| [token](#token)      | `github.token`     | For use with a PAT to Rollback   |

#### prefix

To disable the prefix, set it to an empty string `prefix: ''`

#### major/minor

Both major and minor versions are parsed from the release tag using `semver`. If you release
version `1.0.0` this will update or create a reference for `v1` and `v1.0`. If you are not using semantic versions, set
both to `false` and provide your own `tags`.

#### tags

The `prefix` is not applied to specified tags. These can be a string list `"v1,v1.0"` or newline
delimited `|`. If you only want to update the specified `tags` make sure to set both `major` and `minor` to `false`.

#### tag

This is the target tag to parse the `sha` from. Defaults to the `sha` that triggered the workflow.
To override this behavior you can specify a target tag here from which the target `sha` will be parsed.
This is the `sha` that all parsed or provided `tags` are updated too. Rolling back requires a PAT.
See [Rolling Back](#rolling-back) for more details and a manual workflow example.

#### create

If `true` this will create the `tag` at the current `sha` of the workflow run.

#### summary

Write a Summary for the job. To disable this set to `false`.

<details><summary>👀 View Example Job Summary</summary>

---

<table><tr><td>Tag</td><td><code>v1.0.1</code></td></tr><tr><td>Sha</td><td><code>9b5d1797561610366c63dcd48b0764f4cdd91761</code></td></tr><tr><td>Tags</td><td><code>v1,v1.0</code></td></tr></table>
<details><summary><strong>Tags</strong></summary><pre lang="text"><code>v1
v1.0</code></pre></details><details><summary>Results</summary><table><tr><th>Tag</th><th>Result</th></tr><tr><td><code>v1</code></td><td>Updated</td></tr><tr><td><code>v1.0</code></td><td>Updated</td></tr></table></details><details><summary><strong>SemVer</strong></summary>

```json
{
  "options": {},
  "loose": false,
  "includePrerelease": false,
  "raw": "v1.0.1",
  "major": 1,
  "minor": 0,
  "patch": 1,
  "prerelease": [],
  "build": [],
  "version": "1.0.1"
}
```

</details>
<details><summary>Inputs</summary><pre lang="yaml"><code>prefix: v
major: true
minor: true
tags: ""
tag: ""
summary: true
dry_run: false
</code></pre>
</details>

---

</details>

#### dry_run

If this is `true` no tags will be created/updated and will only output the results.

#### token

GitHub workflow tokens do not allow for rolling back or deleting tags.
To do this you must create a PAT with the `repo` and `workflow` permissions, add it to secrets, and use it.
See [Rolling Back](#rolling-back) for more information and an example.

For semantic versions, simply add this step to your release workflow:

```yaml
- name: 'Update Tags'
  uses: cssnr/update-version-tags-action@v1
```

### Permissions

This action requires the following permissions:

```yaml
permissions:
  contents: write
```

Permissions documentation for
[Workflows](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/controlling-permissions-for-github_token)
and [Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication).

## Outputs

| Output | Output&nbsp;Description               |
| :----- | :------------------------------------ |
| tags   | Comma Seperated String of Parsed Tags |

Example output:

```text
v1,v1.0
```

Using the outputs:

```yaml
- name: 'Update Tags'
  uses: cssnr/update-version-tags-action@v1
  id: tags

- name: 'Echo Tags'
  run: echo ${{ steps.tags.outputs.tags }}
```

## Examples

This is the workflow used by this Action to update tags on release: [release.yaml](.github/workflows/release.yaml)

```yaml
name: 'Release'

on:
  release:
    types: [published]

jobs:
  release:
    name: 'Release'
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: write

    steps:
      - name: 'Update Tags'
        uses: cssnr/update-version-tags-action@v1
```

Specifying the tags to update or create:

```yaml
- name: 'Update Tags'
  uses: cssnr/update-version-tags-action@v1
  with:
    major: false
    minor: false
    tags: |
      v1
      v1.0
```

Specifying the target tag to update too:

```yaml
- name: 'Update Tags'
  uses: cssnr/update-version-tags-action@v1
  with:
    tag: v1.0.1
```

For more examples, you can check out other projects using this action:  
https://github.com/cssnr/update-version-tags-action/network/dependents

### Rolling Back

To roll back or manually update tags, copy this workflow: [tags.yaml](.github/workflows/tags.yaml)

To rollback tags you must use a PAT with the `repo` and `workflow` permissions.
The target `sha` will be parsed from the target `tag` provided in the UI.

For example, if you releases `v1.0.1` but wanted to roll back to `v1.0.0`.
You would run the workflow with tag `v1.0.0` it would update the `v1` and `v1.0` tags
(or what ever tags you manually specify) to point back to the sha of tag `v1.0.0`.

_This same workflow could be used to manually roll forward without a PAT._

```yaml
name: 'Tags'

on:
  workflow_dispatch:
    inputs:
      tag:
        description: 'Target Tag'
        required: true

jobs:
  tags:
    name: 'Tags'
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: write

    steps:
      - name: 'Update Tags'
        uses: cssnr/update-version-tags-action@v1
        with:
          tag: ${{ inputs.tag }}
          token: ${{ secrets.GH_PAT }}
```

## Tags

The following rolling [tags](https://github.com/cssnr/update-version-tags-action/tags) are maintained.

| Version&nbsp;Tag                                                                                                                                                                                                                     | Rolling | Bugs | Feat. |   Name    |  Target  | Example  |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: | :--: | :---: | :-------: | :------: | :------- |
| [![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&filter=!v*.*&style=for-the-badge&label=%20&color=44cc10)](https://github.com/cssnr/update-version-tags-action/releases/latest) |   ✅    |  ✅  |  ✅   | **Major** | `vN.x.x` | `vN`     |
| [![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&filter=!v*.*.*&style=for-the-badge&label=%20&color=blue)](https://github.com/cssnr/update-version-tags-action/releases/latest) |   ✅    |  ✅  |  ❌   | **Minor** | `vN.N.x` | `vN.N`   |
| [![GitHub Release](https://img.shields.io/github/v/release/cssnr/update-version-tags-action?style=for-the-badge&label=%20&color=red)](https://github.com/cssnr/update-version-tags-action/releases/latest)                           |   ❌    |  ❌  |  ❌   | **Micro** | `vN.N.N` | `vN.N.N` |

You can view the release notes for each version on the [releases](https://github.com/cssnr/update-version-tags-action/releases) page.

The **Major** tag is recommended. It is the most up-to-date and always backwards compatible.
Breaking changes would result in a **Major** version bump. At a minimum you should use a **Minor** tag.

## Badges

You can use [shields.io](https://shields.io/) to generate dynamic badges that always point to the latest tags for semantic versions.

Tag badges can be created here: https://shields.io/badges/git-hub-tag

Set **sort** to `semver` and **filter** to one of the following.

| Version   | Filter    | Example&nbsp;Labels                                                                                                                                | Icons&nbsp;Only                                                                                                                                                           | For&nbsp;The&nbsp;Badge                                                                                                                            | Social&nbsp;Icons                                                                                                                 |
| :-------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| **Major** | `!v*.*`   | ![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&filter=!v*.*&style=flat-square&label=major)   | ![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&filter=!v*.*&logo=git&logoColor=white&labelColor=585858&label=%20)   | ![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&filter=!v*.*&style=for-the-badge&label=%20)   | ![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&filter=!v*.*&style=social)   |
| **Minor** | `!v*.*.*` | ![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&filter=!v*.*.*&style=flat-square&label=minor) | ![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&filter=!v*.*.*&logo=git&logoColor=white&labelColor=585858&label=%20) | ![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&filter=!v*.*.*&style=for-the-badge&label=%20) | ![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&filter=!v*.*.*&style=social) |
| **Micro** |           | ![GitHub Tag Micro](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&style=flat-square&label=micro)                | ![GitHub Tag Micro](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&logo=git&logoColor=white&labelColor=585858&label=%20)                | ![GitHub Tag Micro](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&style=for-the-badge&label=%20)                | ![GitHub Tag Micro](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&style=social)                |

You may need to adjust the filter to match your tagging scheme.

To create a 2 color badge with icon and no text; set a `labelColor` with an empty `label`.

GitHub's media proxy caches images for 1 hour. You can purge the cache by sending a `PURGE` request.

```shell
curl -X PURGE 'https://camo.githubusercontent.com/xxx'
```

# Support

For general help or to request a feature, see:

- Q&A Discussion: https://github.com/cssnr/update-version-tags-action/discussions/categories/q-a
- Request a Feature: https://github.com/cssnr/update-version-tags-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

- Report an Issue: https://github.com/cssnr/update-version-tags-action/issues
- Chat with us on Discord: https://discord.gg/wXy6m2X8wY
- Provide General Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Update%20Version%20Tags)

For more information, see the CSSNR [SUPPORT.md](https://github.com/cssnr/.github/blob/master/.github/SUPPORT.md#support).

# Contributing

Please consider making a donation to support the development of this project
and [additional](https://cssnr.com/) open source projects.

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/cssnr)

If you would like to submit a PR, please review the [CONTRIBUTING.md](#contributing-ov-file).

Additionally, you can support other GitHub Actions I have published:

- [Stack Deploy Action](https://github.com/cssnr/stack-deploy-action?tab=readme-ov-file#readme)
- [Portainer Stack Deploy Action](https://github.com/cssnr/portainer-stack-deploy-action?tab=readme-ov-file#readme)
- [Docker Context Action](https://github.com/cssnr/docker-context-action?tab=readme-ov-file#readme)
- [VirusTotal Action](https://github.com/cssnr/virustotal-action?tab=readme-ov-file#readme)
- [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action?tab=readme-ov-file#readme)
- [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action?tab=readme-ov-file#readme)
- [Docker Tags Action](https://github.com/cssnr/docker-tags-action?tab=readme-ov-file#readme)
- [Update JSON Value Action](https://github.com/cssnr/update-json-value-action?tab=readme-ov-file#readme)
- [JSON Key Value Check Action](https://github.com/cssnr/json-key-value-check-action?tab=readme-ov-file#readme)
- [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action?tab=readme-ov-file#readme)
- [Cloudflare Purge Cache Action](https://github.com/cssnr/cloudflare-purge-cache-action?tab=readme-ov-file#readme)
- [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action?tab=readme-ov-file#readme)
- [Package Changelog Action](https://github.com/cssnr/package-changelog-action?tab=readme-ov-file#readme)
- [NPM Outdated Check Action](https://github.com/cssnr/npm-outdated-action?tab=readme-ov-file#readme)
- [Label Creator Action](https://github.com/cssnr/label-creator-action?tab=readme-ov-file#readme)
- [Algolia Crawler Action](https://github.com/cssnr/algolia-crawler-action?tab=readme-ov-file#readme)
- [Upload Release Action](https://github.com/cssnr/upload-release-action?tab=readme-ov-file#readme)
- [Check Build Action](https://github.com/cssnr/check-build-action?tab=readme-ov-file#readme)
- [Web Request Action](https://github.com/cssnr/web-request-action?tab=readme-ov-file#readme)
- [Get Commit Action](https://github.com/cssnr/get-commit-action?tab=readme-ov-file#readme)

<details><summary>❔ Unpublished Actions</summary>

These actions are not published on the Marketplace, but may be useful.

- [cssnr/draft-release-action](https://github.com/cssnr/draft-release-action?tab=readme-ov-file#readme) - Keep a draft release ready to publish.
- [cssnr/env-json-action](https://github.com/cssnr/env-json-action?tab=readme-ov-file#readme) - Convert env file to json or vice versa.
- [cssnr/push-artifacts-action](https://github.com/cssnr/push-artifacts-action?tab=readme-ov-file#readme) - Sync files to a remote host with rsync.
- [smashedr/update-release-notes-action](https://github.com/smashedr/update-release-notes-action?tab=readme-ov-file#readme) - Update release notes.
- [smashedr/combine-release-notes-action](https://github.com/smashedr/combine-release-notes-action?tab=readme-ov-file#readme) - Combine release notes.

---

</details>

<details><summary>📝 Template Actions</summary>

These are basic action templates that I use for creating new actions.

- [js-test-action](https://github.com/smashedr/js-test-action?tab=readme-ov-file#readme) - JavaScript
- [py-test-action](https://github.com/smashedr/py-test-action?tab=readme-ov-file#readme) - Python
- [ts-test-action](https://github.com/smashedr/ts-test-action?tab=readme-ov-file#readme) - TypeScript
- [docker-test-action](https://github.com/smashedr/docker-test-action?tab=readme-ov-file#readme) - Docker Image

Note: The `docker-test-action` builds, runs and pushes images to [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

---

</details>

For a full list of current projects visit: [https://cssnr.github.io/](https://cssnr.github.io/)
