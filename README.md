# Update Tags Action

Update Tags on Tag Push or Release for Semantic Versions.

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
If you only want to update specified provided `tags` make sure to set both `major` and `minor` to `false`.

```yaml
  - name: "Update Tags"
    uses: cssnr/update-tags-action@master
    with:
      token: ${{ secrets.GITHUB_TOKEN }}
      prefix: "v"
      major: true
      minor: true
      tags: |
        v1
        v1.0
```
