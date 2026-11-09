---
category: Forms
---

<script setup lang="ts">
import { ref } from 'vue';
import { LnxDatePicker } from '.';
import { useComponent } from './docs.js';
import type { Item } from '../date-picker-window';

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

const date = ref();
const start = ref();
const end = ref();

const deliveryDate = ref<Date>();
const tripStart = ref<Date>();
const tripEnd = ref<Date>();
const billingMonth = ref<Date>();
const appointment = ref<Date>();
const dueDate = ref('');
const visit = ref('');

const startOfToday = new Date(new Date().toDateString());
function isPastDay(item: Item) {
    return 'weekDay' in item && new Date(item.year, item.month, item.number) < startOfToday;
}
</script>

# DatePicker

The date picker component allows users to select dates or date ranges. It triggers a dropdown containing the [DatePickerWindow](/components/date-picker-window/) when interacting with the input field.

<DemoContainer 
    v-slot="{ addEmit, variation, showcasedProp}"
    v-model:props="componentProps"
    v-model:options="componentOptions"
    v-model:slots="componentSlots"
    v-model:events="componentEvents"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxDatePicker
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
        v-model="date"
        v-model:start="start"
        v-model:end="end"
        :placeholder="showcasedProp === 'Placeholder' ? variation : componentOptions['Placeholder'].value"
        :readonly="showcasedProp === 'Makeitreadonly' ? variation : componentOptions['Make it readonly'].value"
        :disabled="showcasedProp === 'Makeitdisabled' ? variation : componentOptions['Make it disabled'].value || undefined"
        @click="addEmit('click', $event)"
    >
        <template
            v-for="[name, data] in Object.entries(componentSlots).filter(([, data]) => !!data.value)"
            :key="name"
            #[name]
        >
            <span v-html="data.value" />
        </template>
    </LnxDatePicker>
    <span style="width: 100%; margin-top: 16px; padding-top: 8px; border-top: 1px solid var(--lnx-color-gray-0);">
        <template v-if="!props.isRange">
            <strong>Selected date:</strong> {{ date }}
        </template>
        <template v-else>
            <strong>Selected start date:</strong> {{ start }}
            <br>
            <strong>Selected end date:</strong> {{ end }}
        </template>
    </span>
</DemoContainer>

::: info Dates and timezones
Selected dates are emitted at 00:00 UTC (for example, `2026-11-05T00:00:00.000Z`), and the dates you pass in are read in UTC, so every user sees the same day whatever their timezone. To set a value, use a date at 00:00 UTC such as `new Date('2026-11-05')` or `new Date(Date.UTC(2026, 10, 5))`. Avoid `new Date()` or `new Date(2026, 10, 5)`: they are local times, and in some timezones they fall on another day in UTC.
:::

## When to use
- For a date field in a form: the calendar opens below the field and closes once a date is picked.
- When the calendar should stay open on the page, like a filter in a sidebar, use a [DatePickerWindow](/components/date-picker-window/).

## Examples

### Single date
```vue example
<LnxDatePicker v-model="deliveryDate" placeholder="Pick a date">
  Delivery date
</LnxDatePicker>
```

### Date range
With `is-range`, bind `v-model:start` and `v-model:end` instead of `v-model`.

```vue example
<LnxDatePicker v-model:start="tripStart" v-model:end="tripEnd" is-range>
  Trip dates
</LnxDatePicker>
```

### Months
`calendar-type` picks months or years instead of days.

```vue example
<LnxDatePicker v-model="billingMonth" calendar-type="month">
  Billing month
</LnxDatePicker>
```

### Disabled dates
`is-item-disabled-fn` gets every day, month or year the calendar shows and returns `true` for the ones that can't be picked.

```vue example
<LnxDatePicker v-model="appointment" :is-item-disabled-fn="isPastDay">
  Appointment
</LnxDatePicker>
```

```ts
const startOfToday = new Date(new Date().toDateString());
function isPastDay(item: Item) {
  /* Only days have a `weekDay`; months start at 0, like in `Date` */
  return 'weekDay' in item && new Date(item.year, item.month, item.number) < startOfToday;
}
```

### Dates as text
With `value-format="iso-date"`, the v-models hold `'YYYY-MM-DD'` texts (`''` when empty) instead of `Date`s, ready for a form or an API. The day picked is the day stored, whatever the timezone.

```vue example
<LnxDatePicker v-model="dueDate" value-format="iso-date">
  Due date
</LnxDatePicker>
<p>v-model: {{ JSON.stringify(dueDate) }}</p>
```

### Limits
`min` and `max` take a `Date` or a `'YYYY-MM-DD'` text. The days outside are disabled, but you can still browse to other months: a month or year is only disabled when all its days are out.

```vue example
<LnxDatePicker v-model="visit" value-format="iso-date" min="2026-11-05" max="2027-02-15">
  Visit
</LnxDatePicker>
```

<!--@api-->

## Types

### DateValueFormat
<<< ./helpers.ts#DateValueFormat

### CalendarViewType
<<< ../date-picker-window/types.ts#CalendarViewTypes