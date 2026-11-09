---
category: Forms
---

<script setup lang="ts">
import { computed, ref } from 'vue';
import { LnxCheckbox } from '.';
import { LnxButton } from '../button';
import { useComponent } from './docs.js';

const {
    componentProps,
    props,
    componentSlots,
    componentEvents,
    demoCode,
    reset,
} = useComponent();

const accepted = ref(false);
const channels = ref<string[]>(['email']);
const CHANNELS = ['email', 'sms', 'push'];
const allChannels = computed({
    get: () => channels.value.length === CHANNELS.length,
    set: (checked) => { channels.value = checked ? [...CHANNELS] : []; },
});
const terms = ref(false);
</script>

# Checkbox

A box the user checks to say yes to one thing, or to pick several options of a list.

<DemoContainer
    v-slot="{ addEmit, variation, showcasedProp }"
    v-model:props="componentProps"
    v-model:slots="componentSlots"
    v-model:events="componentEvents"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxCheckbox
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
        @update:model-value="addEmit('update:modelValue', $event)"
    >
        <template
            v-for="[name, data] in Object.entries(componentSlots).filter(([, data]) => !!data.value)"
            :key="name"
            #[name]
        >
            <span v-html="data.value" />
        </template>
    </LnxCheckbox>
</DemoContainer>

## When to use
- For one yes or no that the user confirms with a form, like accepting terms.
- For several options of a short list. With many options, or to show them as chips, use a [RadioGroup](/components/radio-group/) with `multiple`.
- For a setting that applies at once, use a [Switch](/components/switch/).

## Examples

### Yes or no
With a boolean `v-model`. A click on the label checks it too, and so does the space bar when it has the focus. A long label wraps with the box on its first line.

```vue example
<LnxCheckbox v-model="accepted">
  Send me a summary of the minutes after every meeting of the board, with the agreements and the votes
</LnxCheckbox>
<span>{{ accepted }}</span>
```

### Several options
With an array `v-model`, each checkbox adds or removes its `value`. `indeterminate` shows that only some are checked.

```vue example
<LnxCheckbox v-model="allChannels" :indeterminate="channels.length > 0 && !allChannels">
  All channels
</LnxCheckbox>
<LnxCheckbox v-for="channel in CHANNELS" :key="channel" v-model="channels" :value="channel" style="margin-left: 26px">
  {{ channel }}
</LnxCheckbox>
<span>{{ channels }}</span>
```

### Required
Attributes go to the native `<input>`, so `required` works with the validation of the form.

```vue example
<form @submit.prevent>
  <LnxCheckbox v-model="terms" required has-error custom-validity="You need to accept the terms">
    I accept the terms
  </LnxCheckbox>
  <LnxButton type="submit">Send</LnxButton>
</form>
```

<!--@api-->

## Accessibility
- It's a native checkbox: the space bar checks it and the label names it.
- `indeterminate` is read out as "mixed".
- The `customValidity` message is set as the native validity, so the form won't submit while it's shown.
