<script setup lang="ts">
import { LnxModal } from '.';
import { useComponent } from './docs.js';
import { LnxButton, LnxIcon, ButtonVariants, ButtonModes } from '..';

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

# Modal

Modals are used to display content in a layer above the main application, often requiring user interaction before returning to the main content.

<DemoContainer 
    v-slot="{ addEmit, variation, showcasedProp}"
    v-model:props="componentProps"
    v-model:slots="componentSlots"
    v-model:events="componentEvents"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxModal
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
        @open="addEmit('open')"
        @close="addEmit('close')"
    >
        <template #default="{ open, close }">
            <LnxButton @click="open()">Open extra-long dialog</LnxButton>
        </template>
        <template #icon>
            <LnxIcon icon="mdi:warning" :size="24" style="color: var(--lnx-color-danger)" />
        </template>
        <template #actions>
            <LnxButton :variant="ButtonVariants.GRAYSCALE" :mode="ButtonModes.CLEAR">
                A secondary action
            </LnxButton>
            <LnxButton :variant="ButtonVariants.GRAYSCALE">
                Another action
            </LnxButton>
            <LnxButton @click="scopes.close()">
                Close
            </LnxButton>
        </template>
        <template
            v-for="[name, data] in Object.entries(componentSlots).filter(([, data]) => !!data.value && !data.readonly)"
            :key="name"
            #[name]="a"
        >
            <span v-html="data.value" />
        </template>
    </LnxModal>
</DemoContainer>