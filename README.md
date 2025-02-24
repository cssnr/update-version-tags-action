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

| input   | required | default           | description                      |
| ------- | :------: | ----------------- | -------------------------------- |
| prefix  |    -     | `v`               | Tag Prefix for Semantic Versions |
| major   |    -     | `true`            | Update Major Tag \*              |
| minor   |    -     | `true`            | Update Minor Tag \*              |
| tags    |    -     | -                 | Additional Tags to Update \*     |
| tag     |    -     | `github.ref_name` | Manually Set Target Tag \*\*     |
| summary |    -     | `true`            | Add Summary to Job               |
| dry_run |    -     | `false`           | Do not create tags, outout only  |
| token   |    -     | `github.token`    | Only for PAT for rollback \*     |

**major/minor** - Both major and minor versions are parsed from the release tag using `semver`. If you release
version `1.0.0` this will update or create a reference for `v1` and `v1.0`. If you are not using semantic versions, set
both to `false` and provide your own `tags`.

**tags** - The `prefix` is not applied to specified tags. These can be a string list `"v1,v1.0"` or newline
delimited `|`. If you only want to update the specified `tags` make sure to set both `major` and `minor` to `false`.

**tag** - The target tag and sha is parsed from the tag that triggered the workflow.
To override this behavior you can specify a target tag here from which the target sha will be parsed.

**summary** - Write a Summary for the job. To disable this set to `false`.

**token** - GitHub workflow tokens do not allow for rolling back or deleting tags.
To do this you must create a PAT with the `repo` permissions and use that.

<details><summary>📜 View Example Job Summary</summary>

---

<table><tr><td>Tag</td><td><code>v1.0.1</code></td></tr><tr><td>Sha</td><td><code>18141a903df47d330633e252b8c122c4469f3a4e</code></td></tr><tr><td>Tags</td><td><code>v1,v1.0</code></td></tr></table>
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

</details><details><summary>Inputs</summary><table><tr><th>Input</th><th>Value</th></tr><tr><td>prefix</td><td><code>v</code></td></tr><tr><td>major</td><td><code>true</code></td></tr><tr><td>minor</td><td><code>true</code></td></tr><tr><td>tags</td><td><code></code></td></tr><tr><td>summary</td><td><code>true</code></td></tr><tr><td>dry_run</td><td><code>false</code></td></tr></table></details>

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
- Provide General Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Update%20Version%20Tags)

# Contributing

Currently, the best way to contribute to this project is to star this project on GitHub.

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

For a full list of current projects to support visit: [https://cssnr.github.io/](https://cssnr.github.io/)
