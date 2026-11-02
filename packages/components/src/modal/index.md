---
category: Overlays
---

<script setup lang="ts">
import { LnxModal } from '.';
import { useComponent } from './docs.js';
import { LnxButton, LnxIcon, BUTTON_VARIANTS, BUTTON_MODES } from '..';

const {
    componentProps,
    props,
    componentOptions,
    componentSlots,
    componentEvents,
    componentCSSVars,
    configurableOptions,
    demoCode,
    reset,
} = useComponent();
</script>

# Modal

Modals are used to display content in a layer above the main application, often requiring user interaction before returning to the main content.

<DemoContainer 
    v-slot="{ addEmit, variation, showcasedProp}"
    v-model:props="componentProps"
    v-model:slots="componentSlots"
    v-model:events="componentEvents"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxModal
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
        @open="addEmit('open')"
        @close="addEmit('close')"
    >
        <template #default="{ open, close }">
            <LnxButton @click="open()">Open extra-long dialog</LnxButton>
        </template>
        <template #icon>
            <LnxIcon icon="mdi:warning" :size="24" style="color: var(--lnx-color-danger)" />
        </template>
        <template #actions>
            <LnxButton :variant="BUTTON_VARIANTS.GRAYSCALE" :mode="BUTTON_MODES.CLEAR">
                A secondary action
            </LnxButton>
            <LnxButton :variant="BUTTON_VARIANTS.GRAYSCALE">
                Another action
            </LnxButton>
            <LnxButton @click="scopes.close()">
                Close
            </LnxButton>
        </template>
        <template
            v-for="[name, data] in Object.entries(componentSlots).filter(([, data]) => !!data.value && !data.readonly)"
            :key="name"
            #[name]="a"
        >
            <span v-html="data.value" />
        </template>
    </LnxModal>
</DemoContainer>

## When to use
- To interrupt the user for a decision they must take before going on, like confirming a deletion.
- For short tasks that don't need their own page.
- Not for information that can wait: show it on the page instead.

## Examples

### Confirmation
The default slot holds the element that opens the modal, and gets `open()` and `close()`. The `actions` slot gets `close()` too.

```vue example
<LnxModal title="Delete project?">
  <template #default="{ open }">
    <LnxButton variant="danger" @click="open()">Delete project</LnxButton>
  </template>
  <template #content>
    The project and all its files will be deleted. This can't be undone.
  </template>
  <template #actions="{ close }">
    <LnxButton variant="grayscale" mode="clear" @click="close()">Cancel</LnxButton>
    <LnxButton variant="danger" @click="close()">Delete</LnxButton>
  </template>
</LnxModal>
```

### Closing from the overlay
By default the modal only closes from its buttons or with <kbd>Esc</kbd>. `allow-close-on-overlay-click` also closes it when the user clicks outside.

```vue example
<LnxModal title="What's new" allow-close-on-overlay-click>
  <template #default="{ open }">
    <LnxButton mode="outline" @click="open()">See what's new</LnxButton>
  </template>
  <template #content>
    Buttons and fields now share the same size variables.
  </template>
</LnxModal>
```

<!--@api-->
