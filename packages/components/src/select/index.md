<script setup lang="ts">
import { LnxSelect } from '.';
import { useComponent } from './docs.js';

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

# Select

[comment]: # (Description of the component)

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
        :disabled="showcasedProp === 'Make it disabled' ? variation : componentOptions['Make it disabled'].value"
        @update:modelValue="addEmit('update:modelValue', $event)"
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