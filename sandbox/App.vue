<script setup lang="ts">
import {
	LnxButton,
	ButtonVariants,
	ButtonModes,
	ButtonSizes,
} from 'lnxjs-components/src';
</script>

<template>
	<div
		v-for="v in ButtonVariants"
		:key="v"
	>
		<div
			v-for="m in ButtonModes"
			:key="m"
		>
			<template
				v-for="s in ButtonSizes"
				:key="s"
			>
				<LnxButton
					:variant="v"
					:mode="m"
					:size="s"
				>
					normal
				</LnxButton>
				<LnxButton
					:variant="v"
					:mode="m"
					:size="s"
					disabled
				>
					disabled
				</LnxButton>
			</template>
		</div>
	</div>
</template>

<style scoped>
div {
	margin: 4px;
	padding: 4px;
	border: 1px solid gray;
	display: flex;
	align-items: flex-start;
	flex-wrap: wrap;
	gap: 4px;
}
</style>