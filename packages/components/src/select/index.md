---
category: Forms
---

<script setup lang="ts">
import { LnxSelect } from '.';
import { useComponent } from './docs.js';
import { ref } from 'vue';

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

const country = ref('');
const users = [
    { id: 1, name: 'Ada Lovelace', role: 'Engineer' },
    { id: 2, name: 'Grace Hopper', role: 'Admiral' },
    { id: 3, name: 'Alan Turing', role: 'Mathematician' },
];
const assignee = ref();
const reviewer = ref();

const ALL_CITIES = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Zaragoza'];
const city = ref('');
const cities = ref<string[]>([]);
const isSearchingCities = ref(false);
function searchCities(query: string) {
    isSearchingCities.value = true;
    /* Stands in for a request to a server */
    setTimeout(() => {
        cities.value = ALL_CITIES.filter(name => name.toLowerCase().includes(query.toLowerCase()));
        isSearchingCities.value = false;
    }, 500);
}
</script>

# Select

A select field that lets users pick one option from a list, with a search box to filter them and support for options loaded asynchronously.

<DemoContainer 
    v-slot="{ addEmit, variation, showcasedProp}"
    v-model:props="componentProps"
    v-model:options="componentOptions"
    v-model:slots="componentSlots"
    v-model:events="componentEvents"
    v-model:css-vars="componentCSSVars"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxSelect
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
        :placeholder="showcasedProp === 'Placeholder' ? variation : componentOptions['Placeholder'].value"
        :disabled="showcasedProp === 'Makeitdisabled' ? variation : componentOptions['Make it disabled'].value"
        @update:modelValue="addEmit('update:modelValue', $event)"
        @query="addEmit('query', $event)"
        @select="addEmit('select', $event)"
    >
        <template
            v-for="[name, data] in Object.entries(componentSlots).filter(([, data]) => !!data.value)"
            :key="name"
            #[name]
        >
            <span v-html="data.value" />
        </template>
    </LnxSelect>
</DemoContainer>

## When to use
- To pick one option from a list. The search box filters it as the user types, so long lists are fine.
- For free text, use an [Input](/components/input/).

## Examples

### Text options
```vue example
<LnxSelect v-model="country" :options="['Spain', 'Portugal', 'France', 'Italy']" placeholder="Choose a country">
  Country
</LnxSelect>
```

### Object options
`label-property` names the field shown for each option, and `v-model` gets the whole object. The search looks in every field of the options, ignoring case and accents.

```vue example
<LnxSelect v-model="assignee" :options="users" label-property="name">
  Assignee
</LnxSelect>
```

### Custom options
The `option` slot decides how each option looks in the list.

```vue example
<LnxSelect v-model="reviewer" :options="users" label-property="name">
  Reviewer
  <template #option="{ option }">
    <strong>{{ option.name }}</strong>&nbsp;· {{ option.role }}
  </template>
</LnxSelect>
```

### Options from a server
With `are-options-async`, the select stops filtering by itself: listen to `query`, fetch the matching options and set `loading-options` while they load.

```vue example
<LnxSelect
  v-model="city"
  :options="cities"
  are-options-async
  :loading-options="isSearchingCities"
  @query="searchCities"
>
  City
</LnxSelect>
```

```ts
async function searchCities(query: string) {
  isSearchingCities.value = true;
  cities.value = await api.getCities(query);
  isSearchingCities.value = false;
}
```

<!--@api-->
