[![Tags](https://img.shields.io/github/actions/workflow/status/cssnr/update-version-tags-action/tags.yaml?logo=github&logoColor=white&label=tags)](https://github.com/cssnr/update-version-tags-action/actions/workflows/tags.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_update-version-tags-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_update-version-tags-action)
[![CSSNR Website](https://img.shields.io/badge/pages-website-blue?logo=github&logoColor=white&color=blue)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
# Update Version Tags Action

Update Version Tags on Push or Release for Semantic Versions.

Automatically maintain both Major `1.x.x` and/or Minor `1.1.x` Tags.

This is useful if you want to automatically update additional tags, to point to your pushed/released tag.
For example, many GitHub Actions maintain a `v1` tag that points to the latest release of the `1.x.x` branch.

*   [Inputs](#Inputs)
*   [Simple Example](#Simple-Example)
*   [Support](#Support)

> [!NOTE]   
> Please submit a [Feature Request](https://github.com/cssnr/update-version-tags-action/discussions/categories/feature-requests)
> for new features or [Open an Issue](https://github.com/cssnr/update-version-tags-action/issues) if you find any bugs.

## Inputs

| input  | required | default | description                             |
|--------|----------|---------|-----------------------------------------|
| token  | Yes      | -       | Token from secrets.GITHUB_TOKEN         |
| prefix | No       | v       | Tag Prefix (empty string to disable)    |
| major  | No       | true    | Update Major Tag (false to disable)     |
| minor  | No       | true    | Update Minor Tag (false to disable)     |
| tags   | No       | -       | Specify Tags to Update (newline or csv) |

Major and Minor versions are parsed from the release tag. If you release version `1.0.0`
this will update or create a reference for `v1` and `v1.0`. The `prefix` is not parsed and must be specified.

Specified tags can be a string list `"v1,v1.0"` or newline delimited `|`.
If you only want to update the provided `tags` make sure to set both `major` and `minor` to `false`.

```yaml
  - name: "Update Tags"
    uses: cssnr/update-version-tags-action@v1
    with:
      token: ${{ secrets.GITHUB_TOKEN }}
      prefix: "v"
      major: true
      minor: true
      tags: |
        v1
        v1.0
```

## Simple Example

This is the workflow used by this Action to update tags on release: [tags.yaml](.github%2Fworkflows%2Ftags.yaml)

```yaml
name: "Tags"

on:
  release:
    types: [published]

jobs:
  tags:
    name: "Tags"
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: "Update Tags"
        uses: cssnr/update-version-tags-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

# Support

For general help or to request a feature, see:

- Q&A Discussion: https://github.com/cssnr/update-version-tags-action/discussions/categories/q-a
- Request a Feature: https://github.com/cssnr/update-version-tags-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

- Report an Issue: https://github.com/cssnr/update-version-tags-action/issues
- Chat with us on Discord: https://discord.gg/wXy6m2X8wY
- Provide General Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Parse%20Issue%20Form)
