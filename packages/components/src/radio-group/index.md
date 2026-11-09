---
category: Forms
---

<script setup lang="ts">
import { ref } from 'vue';
import { LnxRadioGroup } from '.';
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

const CATEGORIES = [
    { value: 'deed', label: 'Deed', icon: 'lucide:scroll-text' },
    { value: 'insurance', label: 'Insurance', icon: 'lucide:shield' },
    { value: 'invoice', label: 'Invoice', icon: 'lucide:receipt' },
    { value: 'other', label: 'Other', icon: 'lucide:file', disabled: true },
];
const category = ref('deed');
const period = ref('month');
const statuses = ref<string[]>(['open']);
const property = ref<{ id: number; name: string }>();
const PROPERTIES = [{ id: 1, name: 'Flat 1A' }, { id: 2, name: 'Flat 2B' }, { id: 3, name: 'Garage 7' }];
const vote = ref<string>();
</script>

# Radio group

A set of options where the user picks one, or several with `multiple`. As chips, as a segmented control or as a classic list of radios.

<DemoContainer
    v-slot="{ addEmit, variation, showcasedProp }"
    v-model:props="componentProps"
    v-model:slots="componentSlots"
    v-model:events="componentEvents"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxRadioGroup
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
        @update:model-value="addEmit('update:modelValue', $event)"
    >
        <span v-html="componentSlots.default.value" />
    </LnxRadioGroup>
</DemoContainer>

## When to use
- For a few options that fit on screen at once, so the user sees them all without opening anything. With many options, use a [Select](/components/select/).
- `segmented` for 2 to 4 options that change a view, like a period.
- `multiple` for filters of several values with the look of chips. For a yes or no, use a [Checkbox](/components/checkbox/).

## Examples

### Chips
Pills that wrap to the next line. The arrows move the selection, as in any group of radios.

```vue example
<LnxRadioGroup v-model="category" :options="CATEGORIES" name="category">
  What kind of document?
</LnxRadioGroup>
```

### Segmented
A joined block. With `is-block`, it takes the whole width.

```vue example
<LnxRadioGroup
  v-model="period"
  mode="segmented"
  hide-legend
  is-block
  :options="[{ value: 'month', label: 'Month' }, { value: 'quarter', label: 'Quarter' }, { value: 'year', label: 'Year' }]"
>
  Period
</LnxRadioGroup>
```

### Several values
`multiple` turns the options into checkboxes and `v-model` into an array. Tab goes through the chips and the space bar picks them.

```vue example
<LnxRadioGroup
  v-model="statuses"
  multiple
  :options="[{ value: 'open', label: 'Open' }, { value: 'in-progress', label: 'In progress' }, { value: 'closed', label: 'Closed' }]"
>
  Status
</LnxRadioGroup>
<span>{{ statuses }}</span>
```

### List and objects
`mode="list"` shows classic radios in a column. Values can be objects, and the `option` slot changes what each option shows.

```vue example
<form @submit.prevent>
  <LnxRadioGroup v-model="property" mode="list" required :options="PROPERTIES.map(p => ({ value: p, label: p.name }))">
    Property
    <template #option="{ option, checked }">
      <span>{{ option.label }}</span>
      <small v-if="checked">(picked)</small>
    </template>
  </LnxRadioGroup>
  <LnxButton type="submit">Save</LnxButton>
</form>
<span>{{ property }}</span>
```

<!--@api-->

## Accessibility
- It's a `<fieldset>` with native inputs: the legend names the group, the arrows move between radios and `name` and `required` work in forms.
- `hide-legend` hides the legend only on screen, so screen readers still read it.
- `disabled` on the radio group disables every option, and `disabled` on an option only that one.

## Types

### RadioGroupOption
<<< ./types.ts#RadioGroupOption

### RadioGroupMode
<<< ./types.ts#RadioGroupMode
