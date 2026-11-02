<script setup lang="ts">
import colors from './tokens/colors.scss?raw';
import typography from './tokens/typography.scss?raw';
import controls from './tokens/controls.scss?raw';
import spacings from './tokens/spacings.scss?raw';
import radii from './tokens/radii.scss?raw';
import elevations from './tokens/elevations.scss?raw';
</script>

# Base tokens

CSS variables shared by every theme. They are included in `lnxjs-components/dist/base.css`, and you can override any of them on `:root`, or on any element to change only what is inside it.

::: tip
To change the size of buttons and form fields, use the control variables described in [Sizing](/get-started#sizing).
:::

## Colors
The brand colors (`--lnx-color-primary*`) are placeholders: a [theme](/themes/bobcat/) or your own styles must set them. The contrast of each color is measured against `--lnx-color-bg`.

<TokenPreview :source="colors" />

::: details SCSS source
<<< ./tokens/colors.scss
:::

## Typography
<TokenPreview :source="typography" />

::: details SCSS source
<<< ./tokens/typography.scss
:::

## Controls
<TokenPreview :source="controls" />

::: details SCSS source
<<< ./tokens/controls.scss
:::

## Spacing
<TokenPreview :source="spacings" />

::: details SCSS source
<<< ./tokens/spacings.scss
:::

## Radii
<TokenPreview :source="radii" />

::: details SCSS source
<<< ./tokens/radii.scss
:::

## Elevations
<TokenPreview :source="elevations" />

::: details SCSS source
<<< ./tokens/elevations.scss
:::
