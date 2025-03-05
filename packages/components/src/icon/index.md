<script setup lang="ts">
import { computed, ref } from 'vue';
import { getDemoCode, resetComponent } from '../../../../.vitepress/components/utils';
import { useProps } from '../../../../.vitepress/components/useProps';
import { ComponentProp } from '../../../../.vitepress/components/types';
import { LnxIcon } from '.';

const componentProps = ref<Record<string, ComponentProp>>({
    icon: {
        description: 'Name of the icon. All Iconify icons are supported, see the full list <a href="https://icon-sets.iconify.design/" target="_blank">here</a>',
        controlType: 'input',
        type: 'string',
        defaultValue: '',
        value: 'pixelarticons:heart',
    },
    size: {
        description: 'Display size of the icon expressed in px',
        controlType: 'number',
        type: 'number',
        defaultValue: 'undefined',
        value: 42,
    },
});
const { props } = useProps(componentProps);

const componentOptions = ref<Record<string, ComponentProp>>({
    'Rotate': {
        description: 'Rotates the icon by the specified degrees, but only in 90-degree increments. If you want custom degrees, use CSS transformations',
        configurableOptionName: 'rotate',
        controlType: 'options',
        options: ['0deg', '90deg', '180deg', '270deg'],
        type: 'number',
        defaultValue: '"0deg"',
        value: '0deg',
    },
    'Flip': {
        description: 'Flips the icon horizontally or vertically',
        configurableOptionName: 'flip',
        controlType: 'options',
        options: ['none', 'horizontal', 'vertical'],
        type: 'boolean',
        defaultValue: '"none"',
        value: 'none',
    },
    'Change color': {
        description: 'You can only change the color of monotone icons. It is applied by changing the <code>color</code> CSS attribute of the icon',
        configurableOptionName: 'style',
        controlType: 'input',
        type: 'string',
        defaultValue: '',
        value: undefined,
        helper: 'Try a hex color like "#FF0000" or a name like "orange"',
    },
});

const configurableOptions = computed<Record<string, ComponentProps>>(() => ({
    rotate: {
        defaultValue: 0,
        value: componentOptions.value['Rotate'].value,
    },
    flip: {
        defaultValue: '"none"',
        value: componentOptions.value['Flip'].value,
    },
    style: {
        defaultValue: '"color: undefined;"',
        value: `color: ${componentOptions.value['Change color'].value};`,
    },
}));
const demoCode = computed(() => getDemoCode({
    componentName: 'LnxButton',
    props: { ...componentProps.value, ...configurableOptions.value },
    options: componentOptions.value,
    checkDefault: (defaultValue, value) => eval(defaultValue) !== value,
}));

function reset() {
    resetComponent({
        props: componentProps.value,
        options: componentOptions.value,
        evalDefaultValue: (defaultvalue) => eval(defaultvalue),
    });
}
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

## Types
```ts

```