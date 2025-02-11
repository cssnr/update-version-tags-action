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

Update Version Tags on Push or Release for Semantic Versions or Custom Tags.

Automatically maintain both Major `1.x.x` and/or Minor `1.1.x` Tags. For GitHub Actions you can just copy and paste this
workflow: [tags.yaml](.github/workflows/tags.yaml)

This is useful if you want to automatically update additional tags, to point to your pushed/released tag.
For example, many GitHub Actions maintain a `v1` and `v1.x` tags that points to the latest release of the `1.x.x`
branch.

- [Inputs](#Inputs)
- [Outputs](#Outputs)
- [Examples](#Examples)
- [Support](#Support)
- [Contributing](#Contributing)

> [!NOTE]  
> Please submit
> a [Feature Request](https://github.com/cssnr/update-version-tags-action/discussions/categories/feature-requests)
> for new features or [Open an Issue](https://github.com/cssnr/update-version-tags-action/issues) if you find any bugs.

## Inputs

| input  | required | default | description                   |
| ------ | -------- | ------- | ----------------------------- |
| token  | **Yes**  | -       | `${{ secrets.GITHUB_TOKEN }}` |
| prefix | No       | v       | Tag Prefix (empty to disable) |
| major  | No       | true    | Update Major Tag \*           |
| minor  | No       | true    | Update Minor Tag \*           |
| tags   | No       | -       | Specify Tags to Update \*     |

**major/minor** - Both major and minor versions are parsed from the release tag using `semver`. If you release
version `1.0.0` this will update or create a reference for `v1` and `v1.0`. If you are not using semantic versions, set
both to `false` and provide your own `tags`.

**tags** - The `prefix` is not applied to specified tags. These can be a string list `"v1,v1.0"` or newline
delimited `|`. If you only want to update the specified `tags` make sure to set both `major` and `minor` to `false`.

```yaml
- name: 'Update Tags'
  uses: cssnr/update-version-tags-action@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
```

> [!IMPORTANT]  
> This action requires **content write permissions** to push tags.
> See [Examples](#Examples) below for details on how to add permissions into your workflow.

## Outputs

| output | description                           |
| ------ | ------------------------------------- |
| tags   | Comma Seperated String of Parsed Tags |

```yaml
- name: 'Update Tags'
  uses: cssnr/update-version-tags-action@v1
  id: tags
  with:
    token: ${{ secrets.GITHUB_TOKEN }}

- name: 'Echo Tags'
  run: echo ${{ steps.tags.outputs.tags }}
```

## Examples

This is the workflow used by this Action to update tags on release: [tags.yaml](.github%2Fworkflows%2Ftags.yaml)

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
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

Specifying the tags to update:

```yaml
- name: 'Update Tags'
  uses: cssnr/update-version-tags-action@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    prefix: 'v'
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
