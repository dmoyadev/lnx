<script setup lang="ts">
type Props = {
	variant?: 'normal' | 'danger';
}
withDefaults(
	defineProps<Props>(),
	{
		variant: 'normal'
	},
);
</script>

<template>
	<button :class="variant">Test Button</button>
</template>

<style scoped lang="scss">
.normal {
	background-color: green;
}
.danger {
	background-color: red;
}
</style>