<script setup lang="ts">
import {
	ButtonModes,
	ButtonShapes,
	ButtonSizes,
	ButtonVariants,
	LnxButton,
} from '../../packages/components/src';

defineEmits<{ reset: [] }>();

const isDark = defineModel<boolean>('isDark', { default: true });
</script>

<template>
	<aside>
		<LnxButton
			:variant="ButtonVariants.GRAYSCALE"
			:mode="ButtonModes.CLEAR"
		<LnxButton
			:variant="ButtonVariants.PRIMARY"
			:size="ButtonSizes.SMALL"
			:shape="ButtonShapes.ICON"
			:mode="ButtonModes.OUTLINE"
			@click="isDark = !isDark"
		>
			{{ isDark ? '🌚' : '🌝' }}
		</LnxButton>

		<LnxButton
			:variant="ButtonVariants.PRIMARY"
			:size="ButtonSizes.SMALL"
			:shape="ButtonShapes.ICON"
			:mode="ButtonModes.OUTLINE"
			@click="$emit('reset')"
		>
			🔄
		</LnxButton>
	</aside>
</template>

<style scoped lang="scss">
aside {
	display: flex;
	gap: 8px;
}
</style>