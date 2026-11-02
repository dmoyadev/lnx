<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
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
onMounted(() => {
	/* The `head` script in config.ts already applied the saved theme */
	selectedTheme.value = Object.values(Themes).find(t => t.name === document.documentElement.dataset.theme) ?? Themes.BOBCAT;
});
watch(selectedTheme, (newTheme) => {
	document.documentElement.dataset.theme = newTheme.name;
	try {
		localStorage.setItem('lnx-theme', newTheme.name);
	} catch {
		/* Storage blocked: the theme just won't be remembered */
	}
});
</script>

<template>
	<section>
		<label
			v-for="theme in Themes"
			:key="theme.name"
			:title="`${theme.name} theme`"
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
				:aria-label="`${theme.name} theme`"
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