<script setup lang="ts">
import { computed, ref } from 'vue';
import { getDemoCode, resetComponent } from '../../../../.vitepress/components/utils';
import { useProps } from '../../../../.vitepress/components/useProps';
import { ComponentProp, ComponentSlot, ComponentEvent } from '../../../../.vitepress/components/types';
import { LnxButton } from '.'; 
import {
    ButtonVariants,
	ButtonModes,
	ButtonSizes,
	ButtonShapes,
} from './types.js'; 

const componentProps = ref<Record<string, ComponentProp>>({
    variant: {
        description: 'Applies different palette of colors',
        controlType: 'select',
        type: 'TButtonVariant',
        options: ButtonVariants,
        defaultValue: 'ButtonVariants.PRIMARY',
        value: ButtonVariants.PRIMARY,
    },
    mode: {
        description: 'Display mode. Recommended for changing the importance',
        controlType: 'select',
        type: 'TButtonMode',
        options: ButtonModes,
        defaultValue: 'ButtonModes.SOLID',
        value: ButtonModes.SOLID,
    },
    size: {
        description: 'Modifies spacing and font sizing',
        controlType: 'select',
        type: 'TButtonSizes',
        options: ButtonSizes,
        defaultValue: 'ButtonSizes.MEDIUM',
        value: ButtonSizes.MEDIUM,
    },
    shape: {
        description: 'Reimagines how it\'s built',
        controlType: 'select',
        type: 'TButtonShapes',
        options: ButtonShapes,
        defaultValue: 'ButtonShapes.NORMAL',
        value: ButtonShapes.NORMAL,
    },
    href: {
        description: 'Converts the button in an anchor tag with the given URL',
        controlType: 'input',
        type: 'string',
        defaultValue: 'undefined',
        value: undefined,
    },
    to: {
        description: 'Converts the button in a router-link with the given route. If `href` is set, this is ignored.',
        controlType: 'input',
        type: 'string | object',
        defaultValue: 'undefined',
        value: undefined,
    },
    isLoading: {
        description: 'When loading, it is disabled and shows a different content',
        controlType: 'switch',
        type: 'boolean',
        defaultValue: 'false',
        value: false,
    },
    isBlock: {
        description: 'Indicates if the button should take the full width of its parent',
        controlType: 'switch',
        type: 'boolean',
        defaultValue: 'false',
        value: false,
    },
});
const { props } = useProps(componentProps);

const componentOptions = ref<Record<string, ComponentProp>>({
    'Make it disabled': {
        description: 'Native HTML attribute to disable the button',
        configurableOptionName: 'disabled',
        controlType: 'switch',
        type: 'boolean',
        defaultValue: false,
        value: false,
    },
    'Add a `target` attribute': {
        description: 'Only works if `href` prop is set. Native HTML attribute to define where the link should open',
        configurableOptionName: 'target',
        controlType: 'input',
        type: 'string',
        defaultValue: 'undefined',
        value: undefined,
    },
});

const componentSlots = ref<Record<string, ComponentSlot>>({
    default: {
        description: 'Actual content of the button',
        value: 'Click me!',
        initialValue: 'Click me!',
    },
    loading: {
        description: 'Displayed content when the button is loading',
        value: '',
    },
    prefix: {
        description: 'Icon that should be prefixed before to the content',
        value: '',
    },
    suffix: {
        description: 'Icon that should be suffixed after to the content',
        value: '',
    },
});

const componentEvents = ref<Record<string, ComponentEvent>>({
    click: {
        description: 'Emitted when the button is clicked',
        type: { name: 'PointerEvent', link: 'https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent' },
        isNative: true,
    }
});

const configurableOptions = computed<Record<string, ComponentProps>>(() => ({
    disabled: {
        defaultValue: false,
        value: componentOptions.value['Make it disabled'].value,
    },
    target: {
        defaultValue: 'undefined',
        value: componentOptions.value['Add a `target` attribute'].value,
    },
}));
const demoCode = computed(() => getDemoCode({
    componentName: 'LnxButton',
    props: { ...componentProps.value, ...configurableOptions.value },
    checkDefault: (defaultValue, value) => eval(defaultValue) !== value,
    options: componentOptions.value,
    slots: componentSlots.value,
    listeners: componentEvents.value,
}));

function reset() {
    resetComponent({
        props: componentProps.value,
        options: componentOptions.value,
        slots: componentSlots.value,
        evalDefaultValue: (defaultvalue) => eval(defaultvalue),
    });
}
</script>

# Button

A button lets the user perform an action with a tap or a click, like starting a new flow or confirming something. It can be also used as an anchor tag to navigate to a different page by setting `to` or `href` props.

<DemoContainer 
    v-slot="{ addEmit, variation, showcasedProp}"
    v-model:props="componentProps"
    v-model:options="componentOptions"
    v-model:slots="componentSlots"
    v-model:events="componentEvents"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxButton
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
        :disabled="showcasedProp === 'Makeitdisabled' ? variation : componentOptions['Make it disabled'].value || undefined"
        :target="componentOptions['Add a \`target\` attribute'].value"
        @click="addEmit('click', $event)"
    >
        <template
            v-for="[name, data] in Object.entries(componentSlots).filter(([, data]) => !!data.value)"
            :key="name"
            #[name]
        >
            <span v-html="data.value" />
        </template>
    </LnxButton>
</DemoContainer>