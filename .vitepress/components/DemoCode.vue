<script setup lang="ts">
import { ButtonModes, ButtonShapes, ButtonVariants, LnxButton } from '../../packages/components/src';
import { ref } from 'vue';

const props = defineProps<{
	code: string;
	showcasedProp?: string;
}>();

const copied = ref(false);
function copyCode() {
	const code = props.code
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
		.replaceAll('</span>', '')
		.replace(/<span style="color: #[0-9A-F]{6}">/g, '')
		.replace(/<--.*$/gm, '');
	navigator.clipboard.writeText(code);
	copied.value = true;
	setTimeout(() => copied.value = false, 1000);
}
</script>

<template>
	<h3 id="demo-code">
		CODE
	</h3>

	<div
		v-bind="$attrs"
		class="demo-code"
	>
		<LnxButton
			:variant="ButtonVariants.GRAYSCALE"
			:shape="ButtonShapes.ICON"
			:mode="ButtonModes.CLEAR"
			class="btn-copy"
			:class="{ 'btn-copied': copied }"
			@click="copyCode()"
		/>

		<pre v-html="code" />
	</div>
</template>

<style scoped lang="scss">
h3 {
	color: var(--vp-c-text-2);
	margin: 8px 0 -16px;
}

.demo-code {
	min-height: 56px;
	transition: all .5s;
	margin-top: 16px;
	border-radius: 8px;
	background-color: var(--vp-code-block-bg);
	padding: 8px 16px;
	position: relative;

	.btn-copy {
		display: none;
		position: absolute;
		top: 8px;
		right: 8px;
		background-image: var(--vp-icon-copy);
		background-position: 50%;
		background-size: 20px;
		background-repeat: no-repeat;
		background-color: var(--vp-code-copy-code-bg);
		border: 1px solid var(--vp-code-copy-code-border-color);

		&.btn-copied {
			background-image: var(--vp-icon-copied);
		}
	}

	&:hover .btn-copy {
		display: block;
	}

	pre {
		margin: 0;
		font-size: var(--vp-code-font-size);;
	}
}
</style>