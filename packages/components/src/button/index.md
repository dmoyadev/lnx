<script setup lang="ts">
import { LnxButton } from '.';
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

# Button

A button lets the user perform an action with a tap or a click, like starting a new flow or confirming something. It can be also used as an anchor tag to navigate to a different page by setting `to` or `href` props.

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

## Types
### ButtonVariant
<<< ./types.ts#ButtonVariant

### ButtonMode
<<< ./types.ts#ButtonMode

### ButtonSize
<<< ./types.ts#ButtonSize

### ButtonShape
<<< ./types.ts#ButtonShape