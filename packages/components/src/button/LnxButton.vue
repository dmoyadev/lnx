<script setup lang="ts">
withDefaults(
	defineProps<{
		variant?: 'normal' | 'danger';
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
	background-color: green;
}
.danger {
	background-color: red;
}
</style>