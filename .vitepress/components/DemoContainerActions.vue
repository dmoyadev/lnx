<script setup lang="ts">
import {
	ButtonModes,
	ButtonShapes,
	ButtonSizes,
	ButtonVariants,
	LnxButton,
} from '../../packages/components/src';
import { LnxIcon } from '../../packages/components/src/icon';

defineEmits<{ reset: [] }>();

const isDark = defineModel<boolean>('isDark', { default: true });
const showCode = defineModel<boolean>('showCode', { default: false });
</script>

<template>
	<aside>
		<LnxButton
			:variant="ButtonVariants.PRIMARY"
			:size="ButtonSizes.SMALL"
			:mode="ButtonModes.OUTLINE"
			@click="showCode = !showCode"
		>
			<template #prefix>
				<LnxIcon :icon="showCode ? 'mynaui:code-square' : 'mynaui:code-square-solid'" />
			</template>
			{{ showCode ? 'Hide code' : 'Show code' }}
		</LnxButton>

		<LnxButton
			:variant="ButtonVariants.PRIMARY"
			:size="ButtonSizes.SMALL"
			:shape="ButtonShapes.ICON"
			:mode="ButtonModes.OUTLINE"
			@click="isDark = !isDark"
		>
			<LnxIcon :icon="isDark ? 'tdesign:mode-dark' : 'iconamoon:mode-light-bold'" />
		</LnxButton>

		<LnxButton
			:variant="ButtonVariants.PRIMARY"
			:size="ButtonSizes.SMALL"
			:shape="ButtonShapes.ICON"
			:mode="ButtonModes.OUTLINE"
			@click="$emit('reset')"
		>
			<LnxIcon icon="ix:hard-reset" />
		</LnxButton>
	</aside>
</template>

<style scoped lang="scss">
aside {
	display: flex;
	gap: 8px;
}
</style>