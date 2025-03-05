<script setup lang="ts">
import 'iconify-icon';
import { computed } from 'vue';

const props = defineProps<{
	icon: string;
	size?: number;
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
