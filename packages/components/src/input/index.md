---
category: Forms
---

<script setup lang="ts">
import { LnxInput } from '.';
import { useComponent } from './docs.js';
import { ref } from 'vue';

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

function handleSubmit() {
    alert('Submitted!');
}

const email = ref('');
const search = ref('');
const password = ref('');
const username = ref('ada');
</script>

# Input

An input component that allows users to enter and edit text.

<DemoContainer
    v-slot="{ addEmit, variation, showcasedProp}"
    v-model:props="componentProps"
    v-model:options="componentOptions"
    v-model:slots="componentSlots"
    v-model:events="componentEvents"
    :demo-code="demoCode"
    @reset="reset()"
>
    <form @submit.prevent="handleSubmit()">
        <LnxInput
            v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
            :type="showcasedProp === 'Inputtype' ? variation : componentOptions['Input type'].value"
            :placeholder="showcasedProp === 'Placeholder' ? variation : componentOptions['Placeholder'].value"
            :readonly="showcasedProp === 'Makeitreadonly' ? variation : componentOptions['Make it readonly'].value"
            :disabled="showcasedProp === 'Makeitdisabled' ? variation : componentOptions['Make it disabled'].value"
            @update:modelValue="addEmit('update:modelValue', $event)"
            @input="addEmit('input', $event.target.value)"
            @change="addEmit('change', $event.target.value)"
        >
            <template
                v-for="[name, data] in Object.entries(componentSlots).filter(([, data]) => !!data.value)"
                :key="name"
                #[name]
            >
                <span v-html="data.value" />
            </template>
        </LnxInput>
    </form>
</DemoContainer>

## When to use
- For short, free text: names, emails, numbers or passwords.
- When there is a fixed list of answers, use a [Select](/components/select/).
- For dates, use a [DatePicker](/components/date-picker/), and for verification codes an [InputOTP](/components/input-otp/).

## Examples

### Label and helper
The default slot is the label. Use the `helper` slot for a hint below the field.

```vue example
<LnxInput v-model="email" type="email" placeholder="ada@example.com">
  Email
  <template #helper>We only use it to send you the receipt</template>
</LnxInput>
```

### Search
`is-clearable` adds a button that empties the field.

```vue example
<LnxInput v-model="search" type="search" placeholder="Search projects" is-clearable>
  Search
</LnxInput>
```

### Password
With `type="password"`, a button lets the user show what they typed.

```vue example
<LnxInput v-model="password" type="password">
  Password
</LnxInput>
```

### Error
Set `has-error` and the message in `custom-validity`, or in the `error` slot for richer content. The message is also set as the native validity of the input, so forms won't submit while it is shown.

```vue example
<LnxInput v-model="username" has-error custom-validity="This username is already taken">
  Username
</LnxInput>
```

<!--@api-->
