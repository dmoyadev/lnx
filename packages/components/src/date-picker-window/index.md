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
</script>

# DatePickerWindow

The date picker window can be used as a standalone component to select dates or date ranges. It is typically used as the [DatePicker](/components/date-picker), but can also be used on its own.

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

## Types

### Item
<<< ./types.ts#Item
<<< ./types.ts#Day
<<< ./types.ts#Month
<<< ./types.ts#Year

### CalendarViewType
<<< ./types.ts#CalendarViewTypes