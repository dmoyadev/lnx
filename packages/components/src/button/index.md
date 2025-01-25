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

<DemoContainer>
    <LnxButton @click="changeTheme">Hola!</LnxButton>
</DemoContainer>