---
category: Overlays
---

<script setup lang="ts">
import { toast } from '.';
import { LnxButton } from '../button';

let receipts = 3;

function save() {
    receipts++;
    toast(`Receipt saved. You have ${receipts}`, { undo: () => { receipts--; } });
}

function fail() {
    toast("Couldn't save: the network is down", { variant: 'danger' });
}
</script>

# Toaster

Short messages at the bottom of the page that tell the user an action is done, and let them undo it. `toast()` shows one from anywhere, also outside components.

## When to use
- To tell that something was done, when the page itself doesn't show it clearly: saved, copied, sent.
- With `undo`, instead of asking for confirmation before an action that can be reverted: it saves the user a click. For those that can't, use [Confirm](/components/confirm/).
- Not for errors in a form: show them next to the field.

## Examples

### Undo
With `undo`, the toast shows an undo button and stays 7 seconds. ⌘Z or Ctrl+Z undoes the newest one too, except while typing in a field, where it's the field's own undo. Afterwards, a toast says it was undone; if the function throws, a danger one says it couldn't.

```vue example
<LnxButton @click="save()">Save</LnxButton>
```

```ts
import { toast } from 'lnxjs-components';

const id = toast('Receipt saved', { undo: () => deleteReceipt() }); // returns the id
```

### Variants
`variant` takes the variants of the [button](/components/button/). Danger ones stay 9 seconds and are read out at once by screen readers.

```vue example
<LnxButton variant="danger" @click="fail()">Fail</LnxButton>
<LnxButton variant="success" @click="toast('Sent to the 12 members', { variant: 'success' })">Send</LnxButton>
<LnxButton variant="info" @click="toast('Copied', { variant: 'info', duration: 2000 })">Copy</LnxButton>
```

### Duration and closing
By default, a toast stays 4 seconds, 7 with `undo` and 9 if it's danger. The bar at the bottom shows the time left and stops while the toast is pointed at or focused. `duration: Infinity` keeps it until it's closed.

```ts
import { dismiss, toast, undo, toasts } from 'lnxjs-components';

const id = toast('Uploading…', { duration: Infinity });
dismiss(id);
await undo();     // the given one, or the newest that can be undone; resolves to whether there was one
toasts;           // the toasts on screen, reactive
```

### Errors when undoing
To log the errors of every undo in one place, pass `onUndoError` to [`createLnx`](/get-started#language). The texts of the buttons and messages come from there too.

```ts
app.use(createLnx({ onUndoError: error => reportError(error) }));
```

### Host
The toasts live in `<LnxToaster />`, which is added to the page with the first `toast()`. If you prefer to place it yourself, render it once in `App.vue` and no other will be added.

```vue [App.vue]
<template>
  <RouterView />
  <LnxToaster />
</template>
```

<!--@api-->

## Accessibility
- The list is an `aria-live="polite"` region: screen readers read each toast when it comes, and danger ones at once, as alerts.
- The close button is named with the `close` text, and the undo shortcut is a visual hint next to its button.
- With reduced motion, toasts only fade.

## Types

### ToastOptions
<<< ./types.ts#ToastOptions

### Toast
<<< ./types.ts#Toast
