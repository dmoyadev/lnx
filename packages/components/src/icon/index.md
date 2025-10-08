<script setup lang="ts">
import { LnxIcon } from '.';
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
</script>

# Icon

A simple icon component that uses the Iconify library to render icons.

<DemoContainer
    v-slot="{ addEmit, variation, showcasedProp}"
    v-model:props="componentProps"
    v-model:options="componentOptions"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxIcon
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
        :style="`color: ${componentOptions['Change color'].value};`"
        :flip="showcasedProp === 'Flip' ? variation : componentOptions['Flip'].value"
        :rotate="showcasedProp === 'Rotate' ? variation : componentOptions['Rotate'].value"
    />
</DemoContainer>