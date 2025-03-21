[![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&filter=!v*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/update-version-tags-action/tags)
[![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/update-version-tags-action?sort=semver&filter=!v*.*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/update-version-tags-action/tags)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/update-version-tags-action?logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/update-version-tags-action/releases/latest)
[![GitHub Dist Size](https://img.shields.io/github/size/cssnr/update-version-tags-action/dist%2Findex.js?label=dist%20size)](https://github.com/cssnr/update-version-tags-action/blob/master/src/index.js)
[![Release](https://img.shields.io/github/actions/workflow/status/cssnr/update-version-tags-action/release.yaml?logo=github&label=release)](https://github.com/cssnr/update-version-tags-action/actions/workflows/release.yaml)
[![Test](https://img.shields.io/github/actions/workflow/status/cssnr/update-version-tags-action/test.yaml?logo=github&label=test)](https://github.com/cssnr/update-version-tags-action/actions/workflows/test.yaml)
[![Lint](https://img.shields.io/github/actions/workflow/status/cssnr/update-version-tags-action/lint.yaml?logo=github&label=lint)](https://github.com/cssnr/update-version-tags-action/actions/workflows/lint.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_update-version-tags-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_update-version-tags-action)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/update-version-tags-action?logo=github&label=updated)](https://github.com/cssnr/update-version-tags-action/graphs/commit-activity)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/cssnr/update-version-tags-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/cssnr/update-version-tags-action)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/update-version-tags-action?logo=htmx)](https://github.com/cssnr/update-version-tags-action)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)

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

GitHub Actions can copy and paste this workflow: [release.yaml](.github/workflows/release.yaml)

> [!NOTE]  
> Please submit a [Feature Request](https://github.com/cssnr/update-version-tags-action/discussions/categories/feature-requests)
> for new features or [Open an Issue](https://github.com/cssnr/update-version-tags-action/issues) if you find any bugs.

For more details see [action.yml](action.yml) and [src/index.js](src/index.js).

## Inputs

| Input     | Req. | Default&nbsp;Value | Description                       |
| :-------- | :--: | :----------------- | :-------------------------------- |
| `prefix`  |  -   | `v`                | Tag Prefix for Semantic Versions  |
| `major`   |  -   | `true`             | Update Major Tag \*               |
| `minor`   |  -   | `true`             | Update Minor Tag \*               |
| `tags`    |  -   | -                  | Additional Tags to Update \*      |
| `tag`     |  -   | `github.ref_name`  | Manually Set Target Tag \*\*      |
| `summary` |  -   | `true`             | Add Summary to Job \*             |
| `dry_run` |  -   | `false`            | Do not Create Tags, Outout Only   |
| `token`   |  -   | `github.token`     | For use with a PAT to Rollback \* |

**major/minor:** Both major and minor versions are parsed from the release tag using `semver`. If you release
version `1.0.0` this will update or create a reference for `v1` and `v1.0`. If you are not using semantic versions, set
both to `false` and provide your own `tags`.

**tags:** The `prefix` is not applied to specified tags. These can be a string list `"v1,v1.0"` or newline
delimited `|`. If you only want to update the specified `tags` make sure to set both `major` and `minor` to `false`.

**tag:** This is the target tag to parse the `sha` from. Defaults to the `sha` that triggered the workflow.
To override this behavior you can specify a target tag here from which the target `sha` will be parsed.
This is the `sha` that all parsed or provided `tags` are updated too. Rolling back requires a PAT.
See [Rolling Back](#rolling-back) for more details and a manual workflow example.

**summary:** Write a Summary for the job. To disable this set to `false`.

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

**token:** GitHub workflow tokens do not allow for rolling back or deleting tags.
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

| Output | Description                           |
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

Currently, the best way to contribute to this project is to star this project on GitHub.

For more information, see the CSSNR [CONTRIBUTING.md](https://github.com/cssnr/.github/blob/master/.github/CONTRIBUTING.md#contributing).

Additionally, you can support other GitHub Actions I have published:

- [Stack Deploy Action](https://github.com/cssnr/stack-deploy-action?tab=readme-ov-file#readme)
- [Portainer Stack Deploy](https://github.com/cssnr/portainer-stack-deploy-action?tab=readme-ov-file#readme)
- [VirusTotal Action](https://github.com/cssnr/virustotal-action?tab=readme-ov-file#readme)
- [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action?tab=readme-ov-file#readme)
- [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action?tab=readme-ov-file#readme)
- [Update JSON Value Action](https://github.com/cssnr/update-json-value-action?tab=readme-ov-file#readme)
- [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action?tab=readme-ov-file#readme)
- [Cloudflare Purge Cache Action](https://github.com/cssnr/cloudflare-purge-cache-action?tab=readme-ov-file#readme)
- [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action?tab=readme-ov-file#readme)
- [Docker Tags Action](https://github.com/cssnr/docker-tags-action?tab=readme-ov-file#readme)
- [Package Changelog Action](https://github.com/cssnr/package-changelog-action?tab=readme-ov-file#readme)
- [NPM Outdated Check Action](https://github.com/cssnr/npm-outdated-action?tab=readme-ov-file#readme)

For a full list of current projects to support visit: [https://cssnr.github.io/](https://cssnr.github.io/)
