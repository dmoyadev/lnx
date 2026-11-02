---
category: Elements
---

<script setup lang="ts">
import { LnxButton } from '.';
import { useComponent } from './docs.js';
import { LnxIcon } from '../icon';

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

## When to use
- For actions: submitting a form, saving changes, opening a [Modal](/components/modal/).
- For navigation, set `href` or `to` so it is a real link that can be opened in a new tab.
- Keep one solid button per view for the main action, and use `outline` or `clear` for the rest so they don't compete.
- For a list of related actions, open them in a [Dropdown](/components/dropdown/) from a single button.

## Examples

### Importance
The mode tells how important an action is: `solid` (the default) for the main one, `outline` or `clear` for the others.

```vue example
<LnxButton>Save</LnxButton>
<LnxButton mode="outline">Preview</LnxButton>
<LnxButton mode="clear">Cancel</LnxButton>
```

### Meaning
The variant tells what the action does: `danger` when it destroys data, `success` to approve, `grayscale` for neutral actions.

```vue example
<LnxButton variant="danger">Delete</LnxButton>
<LnxButton variant="success">Approve</LnxButton>
<LnxButton variant="grayscale">Archive</LnxButton>
```

### With an icon
Use the `prefix` or `suffix` slots. A button with only an icon needs an `aria-label`, so screen readers can tell what it does.

```vue example
<LnxButton>
  <template #prefix>
    <LnxIcon icon="mdi:plus" />
  </template>
  New project
</LnxButton>
<LnxButton shape="icon" aria-label="Settings">
  <LnxIcon icon="mdi:cog" />
</LnxButton>
```

### Loading
While the action runs, `is-loading` disables the button and makes it pulse, keeping its size. The `loading` slot, if given, replaces the content meanwhile.

```vue example
<LnxButton is-loading>Saving</LnxButton>
```

### As a link
With `href` it renders an `<a>`, and with `to` a `router-link`.

```vue example
<LnxButton href="https://github.com/dmoyadev/lnx" target="_blank" mode="link">
  View on GitHub
</LnxButton>
```

<!--@api-->

## Types
### ButtonVariant
<<< ./types.ts#ButtonVariant

### ButtonMode
<<< ./types.ts#ButtonMode

### ButtonShape
<<< ./types.ts#ButtonShape