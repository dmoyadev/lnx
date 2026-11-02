---
category: Forms
---

<script setup lang="ts">
import { LnxInputOTP } from '.';
import { useComponent } from './docs.js';
import { ref } from 'vue';

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

function handleSubmit() {
    alert('Submitted!');
}

const code = ref('');
const pin = ref('');
const wrongCode = ref('123456');
</script>

# InputOTP

A one-time password (OTP) input component that allows users to enter a multi-digit code.

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
    <LnxInputOTP
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }" 
        :disabled="showcasedProp === 'Makeitdisabled' ? variation : componentOptions['Make it disabled'].value || undefined"
        @update:modelValue="addEmit('update:modelValue', $event)"
    >
        <template
            v-for="[name, data] in Object.entries(componentSlots).filter(([, data]) => !!data.value)"
            :key="name"
            #[name]
        >
            <span v-html="data.value" />
        </template>
    </LnxInputOTP>
</DemoContainer>

## When to use
- For one-time codes sent by email or SMS, and short PINs.
- Not for passwords or for numbers of any length: use an [Input](/components/input/).

## Examples

### Verification code
Six digits by default. The user can type them or paste the whole code.

```vue example
<LnxInputOTP v-model="code">
  Verification code
  <template #helper>We sent it to your email</template>
</LnxInputOTP>
```

### PIN
Change the number of digits with `length`.

```vue example
<LnxInputOTP v-model="pin" :length="4">
  PIN
</LnxInputOTP>
```

### Error
```vue example
<LnxInputOTP v-model="wrongCode" has-error>
  Verification code
  <template #error>The code is wrong or has expired</template>
</LnxInputOTP>
```

<!--@api-->
