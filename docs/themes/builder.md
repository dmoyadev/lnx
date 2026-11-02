---
aside: false
---

<script setup lang="ts">
import ThemeBuilder from '../../.vitepress/components/ThemeBuilder.vue';
</script>

# Theme builder

Pick your brand colors and see the components with them. The whole page follows your colors while you are here, so you can also open a select or a date picker. When you like the result, copy the CSS.

<ThemeBuilder />

## Using your theme
1. Paste the CSS in your styles, after the `lnxjs-components` styles.
2. Set the theme name in the `data-theme` attribute of your `html` tag, like with the [built-in themes](/themes/bobcat/).

A theme can also set the fonts: see the typography tokens of [Bobcat](/themes/bobcat/#typography).
