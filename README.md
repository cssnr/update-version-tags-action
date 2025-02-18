[![Tags](https://img.shields.io/github/actions/workflow/status/cssnr/update-version-tags-action/tags.yaml?logo=github&logoColor=white&label=tags)](https://github.com/cssnr/update-version-tags-action/actions/workflows/tags.yaml)
[![Test](https://img.shields.io/github/actions/workflow/status/cssnr/update-version-tags-action/test.yaml?logo=github&logoColor=white&label=test)](https://github.com/cssnr/update-version-tags-action/actions/workflows/test.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_update-version-tags-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_update-version-tags-action)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/update-version-tags-action?logo=github)](https://github.com/cssnr/update-version-tags-action/releases/latest)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/update-version-tags-action?logo=github&logoColor=white&label=updated)](https://github.com/cssnr/update-version-tags-action/graphs/commit-activity)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/cssnr/update-version-tags-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/cssnr/update-version-tags-action)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/update-version-tags-action?logo=htmx&logoColor=white)](https://github.com/cssnr/update-version-tags-action)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&logoColor=white)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)

# Update Version Tags Action

- [Inputs](#Inputs)
  - [Permissions](#Permissions)
- [Outputs](#Outputs)
- [Examples](#Examples)
- [Support](#Support)
- [Contributing](#Contributing)

Update Version Tags on Push or Release for Semantic Versions or Custom Tags.

Automatically maintain both Major `1.x.x` and/or Minor `1.1.x` Tags.

This is useful if you want to automatically update additional tags, to point to your pushed/released tag.
For example, many GitHub Actions maintain a `v1` and `v1.x` tags that points to the latest release of the `v1.x.x` branch.

For GitHub Actions you can just copy and paste this workflow: [tags.yaml](.github/workflows/tags.yaml)

> [!NOTE]  
> Please submit
> a [Feature Request](https://github.com/cssnr/update-version-tags-action/discussions/categories/feature-requests)
> for new features or [Open an Issue](https://github.com/cssnr/update-version-tags-action/issues) if you find any bugs.

## Inputs

| input   | required | default        | description                      |
| ------- | -------- | -------------- | -------------------------------- |
| prefix  | No       | `v`            | Tag Prefix for Semantic Versions |
| major   | No       | `true`         | Update Major Tag \*              |
| minor   | No       | `true`         | Update Minor Tag \*              |
| tags    | No       | -              | Additional Tags to Update \*     |
| summary | No       | `true`         | Add Summary to Job               |
| dry_run | No       | `false`        | Do not create tags, outout only  |
| token   | No       | `github.token` | Only for external tokens         |

**major/minor** - Both major and minor versions are parsed from the release tag using `semver`. If you release
version `1.0.0` this will update or create a reference for `v1` and `v1.0`. If you are not using semantic versions, set
both to `false` and provide your own `tags`.

**tags** - The `prefix` is not applied to specified tags. These can be a string list `"v1,v1.0"` or newline
delimited `|`. If you only want to update the specified `tags` make sure to set both `major` and `minor` to `false`.

**summary** - Write a Summary for the job. To disable this set to `false`.

<details><summary>📜 View Example Summary</summary>

---

sha: `317442b7ca03e5edb918cba5f2f49249011834f6`

**Tags:**

<pre lang="plain"><code>v1
v1.0</code></pre>
<details><summary><strong>Results</strong></summary><table><tr><th>Tag</th><th>Result</th></tr><tr><td>v1</td><td><code>Updated</code></td></tr><tr><td>v1.0</td><td><code>Created</code></td></tr></table></details>
<details><summary><strong>SemVer</strong></summary>

```json
{
  "options": {},
  "loose": false,
  "includePrerelease": false,
  "raw": "1.0.0",
  "major": 1,
  "minor": 0,
  "patch": 0,
  "prerelease": [],
  "build": [],
  "version": "1.0.0"
}
```

</details>
<details><summary><strong>Inputs</strong></summary><table><tr><th>Input</th><th>Value</th></tr><tr><td>prefix</td><td><code>t</code></td></tr><tr><td>major</td><td><code>true</code></td></tr><tr><td>minor</td><td><code>true</code></td></tr><tr><td>tags</td><td><code>v1,v1.0</code></td></tr><tr><td>summary</td><td><code>true</code></td></tr><tr><td>dry_run</td><td><code>true</code></td></tr></table></details>

---

</details>

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

## Outputs

| output | description                           |
| ------ | ------------------------------------- |
| tags   | Comma Seperated String of Parsed Tags |

```yaml
- name: 'Update Tags'
  uses: cssnr/update-version-tags-action@v1
  id: tags

- name: 'Echo Tags'
  run: echo ${{ steps.tags.outputs.tags }}
```

## Examples

This is the workflow used by this Action to update tags on release: [tags.yaml](.github/workflows/tags.yaml)

```yaml
name: 'Tags'

on:
  release:
    types: [published]

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
```

Specifying the tags to update:

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

# Support

For general help or to request a feature, see:

- Q&A Discussion: https://github.com/cssnr/update-version-tags-action/discussions/categories/q-a
- Request a Feature: https://github.com/cssnr/update-version-tags-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

- Report an Issue: https://github.com/cssnr/update-version-tags-action/issues
- Chat with us on Discord: https://discord.gg/wXy6m2X8wY
- Provide General
  Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Update%20Version%20Tags)

# Contributing

Currently, the best way to contribute to this project is to star this project on GitHub.

Additionally, you can support other GitHub Actions I have published:

- [VirusTotal Action](https://github.com/cssnr/virustotal-action)
- [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action)
- [Update JSON Value Action](https://github.com/cssnr/update-json-value-action)
- [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action)
- [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action)
- [Stack Deploy Action](https://github.com/cssnr/stack-deploy-action)
- [Portainer Stack Deploy](https://github.com/cssnr/portainer-stack-deploy-action)
- [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action)

For a full list of current projects to support visit: [https://cssnr.github.io/](https://cssnr.github.io/)
