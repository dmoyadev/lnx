<script setup lang="ts">
import { ref, watch } from 'vue';
import { LnxIcon } from '../../packages/components/src/icon';

defineProps<{ screenMenu?: boolean }>();

const Themes = {
	BOBCAT: {
		name: 'bobcat',
		color: '#7fc1dc',
		icon: 'mingcute:snow-fill',
	},
	IBERIAN: {
		name: 'iberian',
		color: '#ec9c5d',
		icon: 'material-symbols:forest-outline-rounded',
	},
} as const;

const selectedTheme = ref<typeof Themes[keyof typeof Themes]>(Themes.BOBCAT);
watch(selectedTheme, (newTheme) => {
	if(import.meta.env.SSR) { return; }
	const html = document?.querySelector('html');
	html?.setAttribute('data-theme', newTheme.name);
}, { immediate: true });
</script>

<template>
	<section>
		<label
			v-for="theme in Themes"
			:key="theme.name"
		>
			<LnxIcon
				:icon="theme.icon"
				:style="`color: ${selectedTheme.name === theme.name ? theme.color : 'var(--lnx-color-gray-5)'}`"
			/>
			<input
				v-model="selectedTheme"
				type="radio"
				name="theme"
				:value="theme"
			>
		</label>
	</section>
</template>

<style scoped lang="scss">
section {
	width: fit-content;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: var(--lnx-color-gray-9);
	border-radius: 30px;
	height: 32px;
	align-self: center;
	padding: 0 8px;

	label {
		transition: all 200ms;
		position: relative;
		display: inline-flex;
		height: 32px;
		padding: 4px 12px;
		cursor: pointer;

		&::before {
			content: "";
			position: absolute;
			width: 0;
			height: 2px;
			left: 50%;
			transform: translateX(-50%);
			top: 29px;
			background: var(--lnx-color-primary);
			transition: all 200ms;
		}

		&:has(input:checked)::before {
			width: 24px;
		}
	}
}
</style>