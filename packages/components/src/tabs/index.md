---
category: Elements
---

<script setup lang="ts">
import { ref } from 'vue';
import { LnxTabs } from '.';
import { useComponent } from './docs.js';

const {
    componentProps,
    props,
    componentSlots,
    componentEvents,
    demoCode,
    reset,
} = useComponent();

const TABS = [
    { value: 'overview', label: 'Overview', icon: 'lucide:house' },
    { value: 'documents', label: 'Documents', badge: 12 },
    { value: 'tenants', label: 'Tenants' },
];
const tab = ref('overview');
const filter = ref('all');
const FILTERS = [
    { value: 'all', label: 'All', badge: 48 },
    { value: 'open', label: 'Open', badge: 5 },
    { value: 'closed', label: 'Closed', badge: 43 },
];
</script>

# Tabs

Switches between views of the same thing, one at a time. Each tab can show its own panel, or only the bar to drive something else, like a filter or a route.

<DemoContainer
    v-slot="{ addEmit, variation, showcasedProp }"
    v-model:props="componentProps"
    v-model:slots="componentSlots"
    v-model:events="componentEvents"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxTabs
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
        @update:model-value="componentProps['v-model'].value = $event; addEmit('update:modelValue', $event)"
    />
</DemoContainer>

## When to use
- For views of the same object that the user moves between, like the sections of a property. Each view should make sense on its own.
- As the bar of a list, to filter it by status. Then leave out the slots and use `v-model`.
- To pick an option inside a form, use a [Radio group](/components/radio-group/) with `mode="segmented"`.

## Examples

### With panels
Each tab shows the slot named as its value. The arrows move between tabs, and Home and End go to the first and the last.

```vue example
<LnxTabs v-model="tab" :tabs="TABS" aria-label="Property">
  <template #overview>
    The flat is rented until June.
  </template>
  <template #documents>
    12 documents, the last one uploaded yesterday.
  </template>
  <template #tenants>
    Two tenants.
  </template>
</LnxTabs>
```

### Only the bar
Without slots only the bar is shown, and `v-model` tells which tab is selected.

```vue example
<LnxTabs v-model="filter" :tabs="FILTERS" aria-label="Status" />
<p>Showing: {{ filter }}</p>
```

### With routes
With `to`, a tab is a link: it navigates with vue-router and is active while its route, or one inside it, is the current one. Without vue-router, it's a plain link.

```vue
<LnxTabs
  aria-label="Property"
  :tabs="[
    { value: 'overview', label: 'Overview', to: '/properties/7' },
    { value: 'documents', label: 'Documents', to: '/properties/7/documents' },
  ]"
/>
<RouterView />
```

<!--@api-->

## Types

### Tab
<<< ./types.ts#Tab
