---
category: Forms
---

<script setup lang="ts">
import { ref } from 'vue';
import { LnxSwitch } from '.';
import { useComponent } from './docs.js';

const {
    componentProps,
    props,
    componentSlots,
    componentEvents,
    demoCode,
    reset,
} = useComponent();

const notifications = ref(true);
const digest = ref(false);
const isSaving = ref(false);
function save(value: boolean) {
    isSaving.value = true;
    setTimeout(() => {
        digest.value = value;
        isSaving.value = false;
    }, 1000);
}
</script>

# Switch

Turns a setting on or off, and the change applies at once. Screen readers announce it as a switch, on or off.

<DemoContainer
    v-slot="{ addEmit, variation, showcasedProp }"
    v-model:props="componentProps"
    v-model:slots="componentSlots"
    v-model:events="componentEvents"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxSwitch
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
        @update:model-value="componentProps['v-model'].value = $event; addEmit('update:modelValue', $event)"
    >
        <span v-html="componentSlots.default.value" />
        <template
            v-if="componentSlots.helper.value"
            #helper
        >
            <span v-html="componentSlots.helper.value" />
        </template>
    </LnxSwitch>
</DemoContainer>

## When to use
- For a setting that applies as soon as it changes, like turning notifications on.
- For a choice that only applies when a form is submitted, or to accept terms, use a [Checkbox](/components/checkbox/).

## Examples

### Settings row
With `label-position="start"` the label goes first and the switch at the end of the row.

```vue example
<LnxSwitch v-model="notifications" label-position="start">
  Email notifications
  <template #helper>
    When someone comments on an issue you follow.
  </template>
</LnxSwitch>
```

### Saving
While the change is saved, `is-loading` disables the switch and shows a spinner in the thumb.

```vue example
<LnxSwitch :model-value="digest" :is-loading="isSaving" @update:model-value="save">
  Weekly digest
</LnxSwitch>
```

<!--@api-->

## Types

### SwitchLabelPosition
<<< ./types.ts#SwitchLabelPosition
