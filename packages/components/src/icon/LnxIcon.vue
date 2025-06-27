<script setup lang="ts">
import 'iconify-icon';
import { computed } from 'vue';

const props = defineProps<{
	icon: string; /* Icon name. All Iconify icons are supported, see the full list [https://icon-sets.iconify.design/](here) */
	size?: number; /* Display size of the icon expressed in px */
}>();
const iconSize = computed<string>(() => props.size ? `${props.size}px` : '1.4em');
</script>

<template>
	<iconify-icon
		:icon
		v-bind="$attrs"
		:style="`font-size: ${iconSize}`"
	/>
</template>
