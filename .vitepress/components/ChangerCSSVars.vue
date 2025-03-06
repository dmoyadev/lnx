<script setup lang="ts">
import { ComponentCSSVars } from './types';
import { LnxIcon } from '../../packages/components/src/icon';

defineProps<{ cssVars: Record<string, ComponentCSSVars> }>();
defineModel<string>('showcasedProp', { default: '' });
</script>

<template>
	<div
		v-for="(cssVar, name) in cssVars"
		:key="name"
		class="css-var"
	>
		<div class="css-var-data">
			<span class="name">
				{{ name }}
			</span>

			<span
				class="description"
				v-html="cssVar.description"
			/>
		</div>

		<div class="css-var-value">
			<div class="value-selection">
				<input
					:value="cssVar.value"
					@input="cssVar.value = ($event.target as HTMLInputElement).value"
				>

				<span
					v-if="cssVar.helper"
					class="helper"
				>
					<LnxIcon
						icon="mdi:information"
						:size="14"
						style="margin-bottom: -3px"
					/>
					{{ cssVar.helper }}
				</span>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.css-var {
	display: flex;
	align-items: center;
	gap: 20px;
	padding: 10px;

	&:not(:last-child) {
		border-bottom: 1px solid var(--vp-code-bg);
	}

	.css-var-data {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		font-size: var(--lnx-font-size-small);

		.name {
			display: flex;
			align-items: center;
			gap: 4px;
			font-weight: bold;
			font-family: var(--lnx-font-family-mono), monospace;
		}

		.description {
			:deep(code) {
				display: inline;
				padding: 4px;
				color: var(--vp-code-color);
				line-height: 1;
			}
		}
	}

	.css-var-value {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
		align-items: flex-end;

		.value-selection {
			display: flex;
			flex-direction: column;
			gap: 4px;

			input {
				width: 200px;
				max-width: 250px;
				padding: 4px 24px 4px 8px;
				border: 1px solid var(--vp-code-bg);
				border-radius: 4px;
				font-size: var(--lnx-font-size-small);

				&:focus {
					outline: 4px auto -webkit-focus-ring-color;
				}
			}

			.helper {
				color: var(--vp-c-text-2);
				font-size: var(--lnx-font-size-legal);
				width: 200px;
				max-width: 250px;
				align-self: flex-end;
				text-align: right;
			}

			:disabled, :has(:disabled) {
				opacity: .5;
			}
		}
	}
}
</style>