[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_update-tags-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_update-tags-action)
[![Tags](https://github.com/cssnr/update-tags-action/actions/workflows/tags.yaml/badge.svg)](https://github.com/cssnr/update-tags-action/actions/workflows/tags.yaml)
# Update Version Tags Action

Update Version Tags on Push or Release for Semantic Versions.

Automatically maintain both Major `1.x.x` and/or Minor `1.1.x` Tags.

This is useful if you want to automatically update additional tags, to point to your pushed/released tag.
For example, many GitHub Actions maintain a `v1` tag that points to the latest release of the `1.x.x` branch.

> [!NOTE]   
> Please submit a [Feature Request](https://github.com/cssnr/update-tags-action/discussions/categories/feature-requests)
> for new features or [Open an Issue](https://github.com/cssnr/update-tags-action/issues) if you find any bugs.

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
    uses: cssnr/update-tags-action@v1
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
        uses: cssnr/update-tags-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```
