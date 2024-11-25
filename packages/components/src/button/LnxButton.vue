<script setup lang="ts">
withDefaults(
	defineProps<{
		variant?: 'normal' | 'light';
	}>(),
	{ variant: 'normal' },
);
</script>

<template>
	<button :class="variant">
		Test Button
	</button>
</template>

<style scoped lang="scss">
.normal {
	background-color: var(--lnx-color-primary);
}
.light {
	background-color: var(--lnx-color-primary-light);
}
</style>