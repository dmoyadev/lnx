<script setup lang="ts">
import colors from './tokens/colors.scss?raw';
import typography from './tokens/typography.scss?raw';
</script>

# Iberian theme

A warm, orange palette.

## Usage
Set it in the `data-theme` attribute of your `html` tag:

```html
<html data-theme="iberian">
```

## Tokens
A theme only sets the brand colors and the fonts. Everything else comes from the [base tokens](/themes/base/), shared by every theme.

### Colors
<TokenPreview :source="colors" />

::: details SCSS source
<<< ./tokens/colors.scss
:::

### Typography
<TokenPreview :source="typography" />

::: details SCSS source
<<< ./tokens/typography.scss
:::
