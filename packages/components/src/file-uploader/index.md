<script setup lang="ts">
import { ref } from 'vue';
import { LnxFileUploader } from '.';
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

const files = ref<File[]>([]);
</script>

# FileUpload

[comment]: # (Description of the component)

<DemoContainer 
    v-slot="{ addEmit, variation, showcasedProp}"
    v-model:props="componentProps"
    v-model:options="componentOptions"
    v-model:slots="componentSlots"
    v-model:events="componentEvents"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxFileUploader
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
        v-model="files"
        :disabled="showcasedProp === 'Makeitdisabled' ? variation : componentOptions['Make it disabled'].value || undefined"
        :multiple="showcasedProp === 'Multiple' ? variation : componentOptions['Multiple'].value"
        :capture="showcasedProp === 'Capture' ? variation : componentOptions['Capture'].value"
        @update:modelValue="addEmit('update:modelValue', $event)"
    >
        <template
            v-for="[name, data] in Object.entries(componentSlots).filter(([, data]) => !!data.value)"
            :key="name"
            #[name]
        >
            <span v-html="data.value" />
        </template>
    </LnxFileUploader>
</DemoContainer>
