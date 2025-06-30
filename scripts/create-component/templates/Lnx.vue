<script setup lang="ts">
const modelValue = defineModel<string>({ required: true });

const props = withDefaults(defineProps<{
	variant?: unknown; /* Applies... */
}>(), { variant: undefined });

const emit = defineEmits<{
	change: [id: number] /* When... */
}>();

const slots = defineSlots<{
	default(): unknown; /* Content... */
}>();

// Component script
</script>

<template>
	<!-- Component template -->
	<div />
</template>

<style scoped lang="scss">
/* Component styles */
</style>