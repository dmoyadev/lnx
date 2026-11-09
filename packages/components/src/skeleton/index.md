---
category: Elements
---

<script setup lang="ts">
import { ref } from 'vue';
import { LnxSkeleton } from '.';
import { LnxButton } from '../button';
import { useComponent } from './docs.js';

const {
    componentProps,
    props,
    demoCode,
    reset,
} = useComponent();

const isLoading = ref(true);
</script>

# Skeleton

A placeholder with the shape of the content that is loading. It only appears after 150ms, so a fast load doesn't make the screen flash.

<DemoContainer 
    v-slot="{ variation, showcasedProp }"
    v-model:props="componentProps"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxSkeleton v-bind="{ ...props, ...{ [showcasedProp]: variation } }" />
</DemoContainer>

## When to use
- While a list, a card or a page loads, with the shape of what will come, so nothing jumps when it arrives.
- For an action that is running, like saving, use the `is-loading` of the [Button](/components/button/) instead.
- Mark the container that is loading with `aria-busy="true"`: skeletons are `aria-hidden`, so screen readers skip them.

## Examples

### Shapes
The heights come from the font sizes of the theme.

```vue example
<div style="display: grid; gap: 12px; width: 100%">
  <LnxSkeleton variant="title" width="40%" />
  <LnxSkeleton />
  <LnxSkeleton variant="small" width="70%" />
  <LnxSkeleton variant="circle" size="40px" />
  <LnxSkeleton variant="rect" height="75px" />
</div>
```

### Paragraph
`lines` stacks several lines, the last one shorter.

```vue example
<LnxSkeleton :lines="3" />
```

### Loading and arriving
Add the `lnx-appear` class to what replaces the skeleton, so it fades in instead of popping.

```vue example
<div :aria-busy="isLoading" style="display: grid; gap: 12px; width: 100%">
  <LnxSkeleton v-if="isLoading" :lines="2" />
  <p v-else class="lnx-appear" style="margin: 0">
    The minutes of the last meeting are ready to sign.
  </p>
  <LnxButton mode="outline" @click="isLoading = !isLoading">
    {{ isLoading ? 'Finish loading' : 'Load again' }}
  </LnxButton>
</div>
```

### Any element
The `lnx-skeleton` class turns any element into a skeleton without changing its markup, hiding what it has inside. Add `lnx-skeleton--title`, `--small`, `--circle` or `--rect` for the other shapes.

```vue example
<LnxButton class="lnx-skeleton" style="width: 120px; height: var(--lnx-control-height)">
  Save
</LnxButton>
```

<!--@api-->

## Styles

| Variable | What it sets |
|---|---|
| `--lnx-skeleton-color` | Background of the skeleton |
| `--lnx-skeleton-shine` | Color of the shine that sweeps it |

## Types

### SkeletonVariant
<<< ./types.ts#SkeletonVariant
