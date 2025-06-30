<script setup lang="ts">
import { Lnx<<ComponentName>> } from '.';
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

# <<ComponentName>>

[comment]: # (Description of the component)

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
    <Lnx<<ComponentName>>
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
    </Lnx<<ComponentName>>>
</DemoContainer>

## Types
```ts

```