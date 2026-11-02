---
category: Forms
---

<script setup lang="ts">
import { ref } from 'vue';
import { LnxDatePickerWindow } from '.';
import { useComponent } from './docs.js';

const {
    componentProps,
    props,
    componentEvents,
    demoCode,
    reset,
} = useComponent();

const date = ref();
const start = ref();
const end = ref();

const day = ref<Date>();
const rangeStart = ref<Date>();
const rangeEnd = ref<Date>();
</script>

# DatePickerWindow

The date picker window can be used as a standalone component to select dates or date ranges. It is typically used as the [DatePicker](/components/date-picker/), but can also be used on its own.

<DemoContainer
    v-slot="{ addEmit, variation, showcasedProp}"
    v-model:props="componentProps"
    v-model:events="componentEvents"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxDatePickerWindow
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
        v-model="date"
        v-model:start="start"
        v-model:end="end"
        @update:modelValue="addEmit('update:modelValue', $event)"
        @update:start="addEmit('update:start', $event)"
        @update:end="addEmit('update:end', $event)"
    />
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
- When the calendar should always be visible: a booking page, a filter panel or a dashboard.
- For a date field in a form, use a [DatePicker](/components/date-picker/): it shows the calendar only while picking.

## Examples

### Single date
```vue example
<LnxDatePickerWindow v-model="day" />
```

### Date range
```vue example
<LnxDatePickerWindow v-model:start="rangeStart" v-model:end="rangeEnd" is-range />
```

<!--@api-->

## Types

### Item
<<< ./types.ts#Item
<<< ./types.ts#Day
<<< ./types.ts#Month
<<< ./types.ts#Year

### CalendarViewType
<<< ./types.ts#CalendarViewTypes