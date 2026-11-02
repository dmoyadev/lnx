---
category: Elements
---

<script setup lang="ts">
import { LnxIcon } from '.';
import { useComponent } from './docs.js';
import { LnxButton } from '../button';

const {
    componentProps,
    props,
    componentOptions,
    componentSlots,
    componentEvents,
    configurableOptions,
    demoCode,
    reset,
} = useComponent();

</script>

# Icon

A simple icon component that uses the Iconify library to render icons.

<DemoContainer
    v-slot="{ addEmit, variation, showcasedProp}"
    v-model:props="componentProps"
    v-model:options="componentOptions"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxIcon
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
        :style="`color: ${componentOptions['Change color'].value};`"
        :flip="showcasedProp === 'Flip' ? variation : componentOptions['Flip'].value"
        :rotate="showcasedProp === 'Rotate' ? variation : componentOptions['Rotate'].value"
    />
</DemoContainer>

## When to use
- Next to text, to make it quicker to scan: in buttons, menus or messages.
- On its own only when its meaning is obvious. If it is the only content of a button, give the button an `aria-label`.
- Any [Iconify](https://icon-sets.iconify.design/) icon works: write its set and name, like `mdi:home`.

## Examples

### Size and color
Icons are 1.4 times the size of the text around them and take its color. Use `size` (in px) and the `color` CSS property to change them.

```vue example
<LnxIcon icon="mdi:home" />
<LnxIcon icon="mdi:home" :size="32" />
<LnxIcon icon="mdi:alert" :size="32" style="color: var(--lnx-color-warning)" />
```

### Inside a button
```vue example
<LnxButton mode="outline">
  <template #prefix>
    <LnxIcon icon="mdi:download" />
  </template>
  Download
</LnxButton>
```

<!--@api-->
