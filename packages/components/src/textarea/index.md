---
category: Forms
---

<script setup lang="ts">
import { ref } from 'vue';
import { LnxTextarea } from '.';
import { useComponent } from './docs.js';

const {
    componentProps,
    props,
    componentSlots,
    componentEvents,
    demoCode,
    reset,
} = useComponent();

const notes = ref('');
const summary = ref('');
const reason = ref('');
</script>

# Textarea

A field for text of several lines. Same label, helper and error as an [Input](/components/input/).

<DemoContainer
    v-slot="{ addEmit, variation, showcasedProp }"
    v-model:props="componentProps"
    v-model:slots="componentSlots"
    v-model:events="componentEvents"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxTextarea
        v-bind="{ ...props, ...{ [showcasedProp]: variation } }"
        @update:model-value="addEmit('update:modelValue', $event)"
    >
        <template
            v-for="[name, data] in Object.entries(componentSlots).filter(([, data]) => !!data.value)"
            :key="name"
            #[name]
        >
            <span v-html="data.value" />
        </template>
    </LnxTextarea>
</DemoContainer>

## When to use
- For free text that may take more than one line: comments, descriptions, notes.
- For a short answer, use an [Input](/components/input/).

## Examples

### Grows with the text
`auto-grow` starts at `rows` and grows as the user writes, up to `max-rows`; then it scrolls. It uses the CSS `field-sizing`: browsers without it keep the size of `rows`.

```vue example
<LnxTextarea v-model="notes" auto-grow rows="2" :max-rows="6" placeholder="Write a few lines…">
  Notes
</LnxTextarea>
```

### Count
With `maxlength` and `show-count`, the characters used show at the right of the helper.

```vue example
<LnxTextarea v-model="summary" maxlength="140" show-count>
  Summary
  <template #helper>It's shown in the list of minutes</template>
</LnxTextarea>
```

### Error
Set `has-error` and the message in `custom-validity`, also set as the native validity of the textarea.

```vue example
<LnxTextarea v-model="reason" has-error custom-validity="Tell us why you reject it">
  Reason
</LnxTextarea>
```

<!--@api-->

## Accessibility
- The label names the textarea. The limit of `maxlength` is native, so the count is only a visual aid.
