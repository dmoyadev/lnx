# Migration guide

What to change in your code when a version renames or removes something. Each section only lists breaking changes: the [changelog](/components/CHANGELOG) has everything else.

## From 0.9 to 0.10

### `LnxButton` no longer submits forms by default
A `LnxButton` that renders a `<button>` now gets `type="button"`, so clicking it inside a `<form>` no longer submits the form. Add `type="submit"` to the buttons that should:

::: code-group
```vue [Before (0.9)]
<form @submit.prevent="save">
  <LnxButton>Save</LnxButton>
</form>
```
```vue [After (0.10)]
<form @submit.prevent="save">
  <LnxButton type="submit">Save</LnxButton>
</form>
```
:::

## From 0.8 to 0.9

Buttons and form fields now share one set of [size variables](/get-started#sizing), so they always line up side by side. Sizes are no longer props.

### `LnxButton` has no `size` prop
The `size` prop, `BUTTON_SIZES` and the `ButtonSize` type are gone, so remove them from your code and imports. To change the size of a button, set the control variables on it, or on any element that contains it:

::: code-group
```vue [Before (0.8)]
<LnxButton :size="BUTTON_SIZES.LARGE">Save</LnxButton>
```
```vue [After (0.9)]
<LnxButton class="large">Save</LnxButton>

<style scoped>
.large {
  --lnx-control-height: 52px;
  --lnx-control-padding-x: var(--lnx-spacing-5);
  --lnx-control-font-size: var(--lnx-font-size-body);
}
</style>
```
:::

These values match the old sizes:

| Old `size` | `--lnx-control-height` | `--lnx-control-padding-x` | `--lnx-control-font-size` |
|---|---|---|---|
| `small` | `26px` | `var(--lnx-spacing-2)` | `var(--lnx-font-size-small)` |
| `medium` (default) | `40px` | `var(--lnx-spacing-3)` | `var(--lnx-font-size-body)` |
| `large` | `52px` | `var(--lnx-spacing-5)` | `var(--lnx-font-size-body)` |

### Buttons and fields are smaller by default
They are now 28px high with small text. The default button used to be 40px high. To keep the 0.8 look across your app, set the `medium` values on `:root`:

```scss [custom-theme.scss]
:root {
  --lnx-control-height: 40px;
  --lnx-control-padding-x: var(--lnx-spacing-3);
  --lnx-control-font-size: var(--lnx-font-size-body);
}
```

Inputs, selects, date pickers and OTP inputs use the same variables, so they grow with the buttons and keep lining up.
