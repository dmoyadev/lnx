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
button {
	--lnx-button-bg-color: var(--lnx-color-primary);
	--lnx-button-bg-color-light: var(--lnx-color-primary-light);

	&.normal {
		background-color: var(--lnx-button-bg-color);
	}

	&.light {
		background-color: var(--lnx-button-bg-color-light);
	}
}
</style>