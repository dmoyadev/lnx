<script setup lang="ts">
import { ref } from 'vue';
import { LnxFileUploader, UploadedFile } from '.';
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

const files = ref<UploadedFile[]>([]);

const isUploading = ref(false);
function fakeUpload(newFiles: File[]) {
    isUploading.value = true;
    for(const file of newFiles) {
        // Simulate an upload process
        setTimeout(() => {
            files.value = [...files.value, { url: file.name, name: file.name }];
            isUploading.value = false;
        }, 1000);   
    }
}

function deleteFile(file: UploadedFile) {
    files.value = files.value.filter(f => f.url !== file.url);
}
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
        :files="props.files || files"
        :is-uploading="props.isUploading || isUploading"
        :disabled="showcasedProp === 'Makeitdisabled' ? variation : componentOptions['Make it disabled'].value || undefined"
        :multiple="showcasedProp === 'Multiple' ? variation : componentOptions['Multiple'].value"
        :capture="showcasedProp === 'Capture' ? variation : componentOptions['Capture'].value"
        @upload="fakeUpload($event); addEmit('upload', $event)"
        @delete="deleteFile($event); addEmit('delete', $event)"
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

## Types
### UploadedFile
<<< ./types.ts#UploadedFile
