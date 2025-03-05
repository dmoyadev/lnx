<script setup lang="ts">
import { LnxInput } from '.';
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

function handleSubmit() {
    alert('Submitted!');
}
</script>

# Icon

A simple icon component that uses the Iconify library to render icons.

<DemoContainer
    v-slot="{ addEmit, variation, showcasedProp}"
    v-model:props="componentProps"
    v-model:options="componentOptions"
    v-model:slots="componentSlots"
    v-model:events="componentEvents"
    :demo-code="demoCode"
    @reset="reset()"
>
    <form @submit.prevent="handleSubmit()">
        <LnxInput
            v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
            :type="showcasedProp === 'Input type' ? variation : componentOptions['Input type'].value"
            :placeholder="showcasedProp === 'Placeholder' ? variation : componentOptions['Placeholder'].value"
            :readonly="showcasedProp === 'Make it readonly' ? variation : componentOptions['Make it readonly'].value"
            :disabled="showcasedProp === 'Make it disabled' ? variation : componentOptions['Make it disabled'].value"
            @update:modelValue="addEmit('update:modelValue', $event)"
            @input="addEmit('input', $event.target.value)"
            @change="addEmit('change', $event.target.value)"
        >
            <template
                v-for="[name, data] in Object.entries(componentSlots).filter(([, data]) => !!data.value)"
                :key="name"
                #[name]
            >
                <span v-html="data.value" />
            </template>
        </LnxInput>
    </form>
</DemoContainer>

## Types
```ts

```