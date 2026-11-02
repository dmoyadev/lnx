---
category: Forms
---

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

const documents = ref<UploadedFile[]>([]);
const isUploadingDocuments = ref(false);
function uploadDocuments(newFiles: File[]) {
    isUploadingDocuments.value = true;
    /* Stands in for a request to a server */
    setTimeout(() => {
        documents.value = [...documents.value, ...newFiles.map(file => ({ url: file.name, name: file.name }))];
        isUploadingDocuments.value = false;
    }, 1000);
}
function deleteDocument(file: UploadedFile) {
    documents.value = documents.value.filter(document => document.url !== file.url);
}
</script>

# FileUploader

A drop zone to pick or drag and drop files, showing the uploaded ones in a list with a loading state while they upload.

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

## When to use
- To let users attach files by picking them or dropping them on the field.
- It doesn't upload anything by itself: it hands you the files and shows the list you give it.

## Examples

### Uploading files
Listen to `upload` to send the files to your server, set `is-uploading` meanwhile, and add what the server returns to `files`. `delete` tells you which file the user wants to remove.

```vue example
<LnxFileUploader
  :files="documents"
  :is-uploading="isUploadingDocuments"
  multiple
  @upload="uploadDocuments"
  @delete="deleteDocument"
>
  Attachments
  <template #helper>You can add several files at once</template>
</LnxFileUploader>
```

```ts
async function uploadDocuments(newFiles: File[]) {
  isUploadingDocuments.value = true;
  documents.value.push(...await api.upload(newFiles)); // Each one with its `url` and `name`
  isUploadingDocuments.value = false;
}

function deleteDocument(file: UploadedFile) {
  documents.value = documents.value.filter(document => document.url !== file.url);
}
```

<!--@api-->

## Types
### UploadedFile
<<< ./types.ts#UploadedFile
