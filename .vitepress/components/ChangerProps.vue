<script setup lang="ts">
import { ComponentProp } from './types';
import { ButtonModes, ButtonSizes, LnxButton } from '../../packages/components/src';

defineProps<{
	props: Record<string, ComponentProp>,
	hideType?: boolean,
	hideAllVariationsButton?: boolean,
}>();

const showcasedProp = defineModel<string>('showcasedProp', { default: '' });

function updateFromInputValue(event: InputEvent, prop: ComponentProp) {
	const value = (event.target as HTMLInputElement).value;

	if(prop.controlType === 'number') {
		if (value === '') {
			prop.value = undefined;
			return;
		}

		prop.value = Number(value);
		return;
	}

	prop.value = value;
}

function canShowAllVariations(prop: ComponentProp): boolean {
	return ['select', 'switch'].includes(prop.controlType);
}
</script>

<template>
	<div
		v-for="(prop, name) in props"
		:key="name"
		class="prop"
	>
		<div class="prop-data">
			<span
				class="name"
				:class="{ 'monospaced': !hideType }"
			>
				{{ name }}
				<code
					v-if="prop.type && !hideType"
					class="type"
				>
					<a :href="`#${prop.type.toLowerCase()}`">{{ prop.type }}</a>
				</code>

			</span>

			<span>{{ prop.description }}</span>

			<span
				v-if="!hideType"
				class="requirement"
			>
				<template v-if="prop.defaultValue">
					Default value:
					<code>{{ prop.defaultValue }}</code>
				</template>
				<template v-else>
					<i>*Required</i>
				</template>
			</span>
		</div>

		<div class="prop-value">
			<div class="value-selection">
				<select
					v-if="prop.controlType === 'select'"
					:value="prop.value"
					:disabled="showcasedProp === name"
					@change="prop.value = ($event.target as HTMLSelectElement).value"
				>
					<option
						v-for="(value, index) in prop.options"
						:key="index"
						:value="value"
					>
						{{ value }}
					</option>
				</select>

				<div
					v-else-if="prop.controlType === 'switch'"
					class="switch"
				>
					<label>
						<input
							type="checkbox"
							:checked="!!prop.value"
							:disabled="showcasedProp === name"
							@change="prop.value = ($event.target as HTMLInputElement).checked"
						>
						<span class="slider" />
					</label>
				</div>

				<input
					v-else
					:type="prop.controlType"
					:value="prop.value"
					:disabled="showcasedProp === name"
					@input="updateFromInputValue($event as InputEvent, prop)"
				>
			</div>

			<LnxButton
				v-if="!hideAllVariationsButton && canShowAllVariations(prop)"
				:mode="ButtonModes.CLEAR"
				:size="ButtonSizes.SMALL"
				class="btn-variations"
				@click="showcasedProp = showcasedProp === name ? '' : name"
			>
				{{ showcasedProp === name ? 'Hide' : 'Show' }} all variations
			</LnxButton>
		</div>
	</div>
</template>

<style scoped lang="scss">
.prop {
	display: flex;
	align-items: center;
	gap: 20px;
	padding: 10px;

	&:not(:last-child) {
		border-bottom: 1px solid var(--vp-code-bg);
	}

	code {
		display: inline;
		min-width: 0;
		line-height: 1;
		color: var(--lnx-color-primary);
	}

	.prop-data {
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

			&.monospaced {
				font-family: var(--lnx-font-family-mono), monospace;
			}

			.type {
				font-size: var(--lnx-font-size-legal);
				font-weight: normal;
				padding: 4px;
			}
		}

		.requirement {
			font-size: var(--lnx-font-size-legal);
			font-weight: normal;
			color: var(--vp-c-text-2);
			padding: 0;
			display: flex;
			align-items: center;
			gap: 4px;

			code {
				font-size: var(--lnx-font-size-legal);
				font-weight: normal;
				padding: 4px;
			}
		}
	}

	.prop-value {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
		align-items: flex-end;

		.value-selection {
			select,
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

			select {
				-webkit-appearance: none;
				-moz-appearance: none;
				appearance: none;
				background: url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>") no-repeat;
				background-position-x: 100%;
				background-position-y: 5px;
			}

			.switch {
				label {
					position: relative;
					display: inline-block;
					width: 48px;
					height: 24px;

					input {
						opacity: 0;
						width: 0;
						height: 0;

						&:checked + .slider {
							background: var(--lnx-color-primary);

							&:before {
								transform: translateX(calc(100% + 4px)) translateY(-50%);
							}
						}

						&:focus + .slider {
							outline: 4px auto -webkit-focus-ring-color;
						}
					}

					.slider {
						position: absolute;
						cursor: pointer;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background: var(--lnx-color-gray-8);
						border-radius: 100px;
						transition: .2s;

						&:before {
							position: absolute;
							content: "";
							height: 18px;
							width: 18px;
							left: 4px;
							top: 50%;
							transform: translateY(-50%);
							background: var(--lnx-color-gray-0);
							box-shadow: var(--lnx-elevation-3);
							border-radius: 50%;
							transition: .2s;
						}
					}
				}
			}

			:disabled, :has(:disabled) {
				opacity: .5;
			}
		}
	}
}
</style>