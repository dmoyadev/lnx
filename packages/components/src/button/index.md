<script setup lang="ts">
import { LnxButton } from '.';

function changeTheme() {
    const html = document.querySelector('html');
    if (html.getAttribute('data-theme') === 'iberian') {
        html.setAttribute('data-theme', 'bobcat');
        return;
    }

    html.setAttribute('data-theme', 'iberian');
}
</script>

# Button

A button lets the user perform an action with a tap or a click, like initiating a new flow or confirming something.

It can be also used as an anchor tag to navigate to a different page by setting `to` or `href` props.

<DemoContainer>
    <LnxButton @click="changeTheme">Hola!</LnxButton>
</DemoContainer>