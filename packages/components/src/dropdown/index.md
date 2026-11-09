---
category: Overlays
---

<script setup lang="ts">
import { ref } from 'vue';
import { LnxDropdown } from '.';
import { LnxInput } from '../input';
import { useComponent } from './docs.js';
import { LnxButton } from '../button';

const {
    componentProps,
    props,
    componentSlots,
    demoCode,
    reset,
} = useComponent();

const showDropdown = ref(false);

const isMenuOpen = ref(false);
</script>

# Dropdown

This component is used to create a dropdown under an element.

<DemoContainer 
    v-slot="{ addEmit, variation, showcasedProp}"
    v-model:props="componentProps"
    v-model:slots="componentSlots"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxDropdown
        :is-open="showDropdown"
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
    >
        <LnxInput @click="showDropdown = true">Open dropdown</LnxInput>
        <template #content>
            <ul><li>Option 1</li><li>Option 2</li></ul>
        </template>
    </LnxDropdown>
</DemoContainer>

## When to use
- For a panel anchored to an element: a menu of actions, filters or a small form.
- To pick a value from a list, use a [Select](/components/select/), which already includes a dropdown with search.
- For content that needs the user's full attention, use a [Modal](/components/modal/).

## Examples

### Menu of actions
The dropdown doesn't open or close by itself: set `is-open` from your state, and close it when an option is picked or the user clicks outside. `width="content"` makes the panel as wide as its own content instead of as wide as the button.

```vue example
<LnxDropdown :is-open="isMenuOpen" width="content">
  <LnxButton mode="outline" @click="isMenuOpen = !isMenuOpen">
    Options
  </LnxButton>
  <template #content>
    <LnxButton mode="clear" variant="grayscale" is-block @click="isMenuOpen = false">
      Rename
    </LnxButton>
    <LnxButton mode="clear" variant="danger" is-block @click="isMenuOpen = false">
      Delete
    </LnxButton>
  </template>
</LnxDropdown>
```

<!--@api-->

## Types

### DropdownWidth
<<< ./types.ts#DropdownWidth
