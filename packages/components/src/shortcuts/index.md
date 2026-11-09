---
category: Elements
---

<script setup lang="ts">
import { ref } from 'vue';
import { LnxKbd, useShortcut, shortcutTitle } from '.';
import { LnxButton } from '../button';
import { LnxInput } from '../input';
import { useComponent } from './docs.js';

const {
    componentProps,
    props,
    demoCode,
    reset,
} = useComponent();

const saved = ref(0);
const text = ref('');
useShortcut('mod+enter', () => saved.value++, { description: 'Save' });
</script>

# Shortcuts

Keyboard shortcuts for your pages: `useShortcut` runs a function when some keys are pressed, `<LnxKbd>` shows those keys next to what they do, and `<LnxShortcutsSheet>` lists every shortcut available at that moment.

<DemoContainer
    v-slot="{ variation, showcasedProp }"
    v-model:props="componentProps"
    :demo-code="demoCode"
    @reset="reset()"
>
    <LnxKbd v-bind="{ ...props, ...{ [showcasedProp]: variation } }" />
</DemoContainer>

## When to use
- For the actions people repeat many times in a page: new, save, search, go to another section.
- Always as a second way: every shortcut needs a button or a link that does the same, because touch screens have no keyboard, and `<LnxKbd>` hides itself there.

## Examples

### A shortcut in a button
`useShortcut` listens while the component is mounted, also inside `<KeepAlive>`: a deactivated page stops listening. `shortcutTitle` writes the title of the button with its keys.

```vue example
<LnxButton :title="shortcutTitle('Save', 'mod+enter')" @click="saved++">
  Save <LnxKbd combo="mod+enter" />
</LnxButton>
<span>Saved {{ saved }} times</span>
```

```ts
useShortcut('mod+enter', () => save(), { description: 'Save' });
```

### While typing
In a text field, single keys are text: only shortcuts with `mod` and `escape` apply. Write in the field and press ⌘↵ or Ctrl+↵.

```vue example
<LnxInput v-model="text" placeholder="Write and save with mod+enter" />
```

### Which one wins
- The newest registered wins, so the `n` of a page takes over the `n` of its layout.
- `enabled` turns a shortcut off while it returns `false`, as if it didn't exist: an Esc that only cancels an open editor, for example.
- Sequences, like `'g i'`, allow one second between keys.
- `?` and `!` already carry the shift in their key: write `'?'`, not `'shift+?'`.

```ts
useShortcut('n', () => createReceipt(), { description: 'New receipt' });
useShortcut('g i', () => router.push('/incidents'), { description: 'Go to incidents' });
useShortcut('escape', () => cancelEdit(), { enabled: () => isEditing.value });
```

### Shortcuts sheet
Render `<LnxShortcutsSheet />` once, in `App.vue`. It opens and closes with `?` and lists the shortcuts with a `description` that are active at that moment. Combos with the same description share a row.

```vue [App.vue]
<template>
  <RouterView />
  <LnxShortcutsSheet :rows="[{ description: 'Undo the last action', combos: ['mod+z'] }]" />
</template>
```

| Prop | Type | Description |
| --- | --- | --- |
| `combo` | `string` | Shortcut that opens and closes the sheet. By default, `'?'` |
| `rows` | `ShortcutRow[]` | Rows always listed after the shortcuts, for those not registered with `useShortcut`, like the undo of the [toasts](/components/toaster/) |

It also exposes `toggle()`, to open it from a button.

### Helpers
- `isTyping(target)`: whether an event comes from a text field.
- `shortcutKeys(combo)`: the labels of the keys, like `['⌘', '↵']`.
- `shortcutTitle(label, combo)`: a title like `'New receipt (N)'`.
- `useEventListener(target, type, handler, options)`: `addEventListener` while the component is mounted and active, also inside `<KeepAlive>`.
- `isMac`: whether `mod` is ⌘.

<!--@api-->

## Accessibility
- `<LnxKbd>` is hidden from screen readers: it's a visual hint, and the button next to it already says what it does.
- Shortcuts don't take over the keys of a text field, except those with `mod` and Esc.
- The sheet is a modal dialog named by its title. Esc closes it and the focus goes back where it was.

## Types

### ShortcutOptions
<<< ./shortcuts.ts#ShortcutOptions

### ShortcutRow
<<< ./types.ts#ShortcutRow
