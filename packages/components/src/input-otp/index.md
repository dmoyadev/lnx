<script setup lang="ts">
import { LnxInputOTP } from '.';
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

function handleSubmit() {
    alert('Submitted!');
}
</script>

# InputOTP

A one-time password (OTP) input component that allows users to enter a multi-digit code.

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
    <LnxInputOTP
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }" 
        :disabled="showcasedProp === 'Makeitdisabled' ? variation : componentOptions['Make it disabled'].value || undefined"
        @update:modelValue="addEmit('update:modelValue', $event)"
    >
        <template
            v-for="[name, data] in Object.entries(componentSlots).filter(([, data]) => !!data.value)"
            :key="name"
            #[name]
        >
            <span v-html="data.value" />
        </template>
    </LnxInputOTP>
</DemoContainer>