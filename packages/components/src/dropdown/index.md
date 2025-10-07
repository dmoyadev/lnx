<script setup lang="ts">
import { ref } from 'vue';
import { LnxDropdown } from '.';
import { LnxInput } from '../input';
import { useComponent } from './docs.js';

const {
    componentProps,
    props,
    componentSlots,
    demoCode,
    reset,
} = useComponent();

const showDropdown = ref(false);
</script>

# Dropdown

This component is used to create a dropdown under an element.

<DemoContainer 
    v-slot="{ addEmit, variation, showcasedProp}"
    v-model:props="componentProps"
    v-model:slots="componentSlots"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxDropdown
        :is-open="showDropdown"
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
    >
        <LnxInput @click="showDropdown = true">Open dropdown</LnxInput>
        <template #content>
            <ul><li>Option 1</li><li>Option 2</li></ul>
        </template>
    </LnxDropdown>
</DemoContainer>