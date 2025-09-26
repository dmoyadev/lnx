<script setup lang="ts">
import { ref } from 'vue';
import { LnxDatePicker } from '.';
import { useComponent } from './docs.js';

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
</script>

# DatePicker

The date picker component allows users to select dates or date ranges. It triggers a dropdown containing the [DatePickerWindow](/components/date-picker-window) when interacting with the input field.

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
        :readonly="showcasedProp === 'Make it readonly' ? variation : componentOptions['Make it readonly'].value"
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

## Types

### CalendarViewType
<<< ../date-picker-window/types.ts#CalendarViewTypes