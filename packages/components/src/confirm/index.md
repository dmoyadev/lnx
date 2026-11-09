---
category: Overlays
---

<script setup lang="ts">
import { ref } from 'vue';
import { useConfirm } from '.';
import { LnxButton } from '../button';

const confirm = useConfirm();
const answer = ref('');

async function deleteMinutes() {
    const confirmed = await confirm({
        title: 'Delete «Minutes 2026»?',
        message: "It can't be undone.",
        confirmText: 'Delete',
        variant: 'danger',
    });
    answer.value = confirmed ? 'Deleted' : 'Kept';
}

async function publish() {
    answer.value = await confirm('Publish the minutes for all the members?') ? 'Published' : 'Not published';
}
</script>

# Confirm

Asks the user to confirm an action in a dialog, and waits for the answer. A themed replacement for `window.confirm`, with a title, a message and your own buttons.

## When to use
- Before an action that can't be undone, like deleting.
- When the action can be undone, prefer doing it at once and offering to undo it in a [toast](/components/toaster/): it saves the user a click.
- To ask for more than a yes or a no, use a [Modal](/components/modal/) with a form.

## Examples

### Destructive action
`useConfirm()` returns a function that opens the dialog and resolves to `true` when the user confirms, and to `false` when they cancel, press Esc or click outside. With `variant: 'danger'`, the focus starts on cancel, so pressing Enter by mistake doesn't delete anything.

```vue example
<LnxButton variant="danger" @click="deleteMinutes()">Delete</LnxButton>
<span>{{ answer }}</span>
```

```ts
const confirm = useConfirm();

async function deleteMinutes() {
  if(!await confirm({
    title: 'Delete «Minutes 2026»?',
    message: "It can't be undone.",
    confirmText: 'Delete',
    variant: 'danger',
  })) { return; }
  // delete…
}
```

### Just a question
A text is the title. The buttons take the `confirm` and `cancel` texts of [`createLnx`](/get-started#language).

```vue example
<LnxButton @click="publish()">Publish</LnxButton>
<span>{{ answer }}</span>
```

### Host
The dialog lives in `<LnxConfirmHost />`, which is added to the page the first time you call `confirm()`. If you prefer to place it yourself, render it once in `App.vue` and no other will be added. Several calls at once are queued and shown one after the other.

```vue [App.vue]
<template>
  <RouterView />
  <LnxConfirmHost />
</template>
```

<!--@api-->

## Accessibility
- The title names the dialog and the message describes it, so screen readers read both when it opens.
- Tab moves between the two buttons, Enter answers with the focused one and Esc cancels.
- When it closes, the focus goes back to where it was, usually the button that opened it.

## Types

### ConfirmOptions
<<< ./types.ts#ConfirmOptions
