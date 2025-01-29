<script setup lang="ts">
import { ButtonModes, ButtonShapes, ButtonVariants, LnxButton } from '../../packages/components/src';

const isDark = defineModel<boolean>('isDark', { default: true });
</script>

<template>
	<aside>
		<LnxButton
			:variant="ButtonVariants.GRAYSCALE"
			:mode="ButtonModes.CLEAR"
			:shape="ButtonShapes.ICON"
			@click="isDark = !isDark"
		>
			{{ isDark ? '🌚' : '🌝' }}
		</LnxButton>
	</aside>
</template>

<style scoped lang="scss">
aside {
	display: flex;
	gap: 8px;
}
</style>