<script setup lang="ts">
import { ComponentProp } from './types';
import { BUTTON_MODES, BUTTON_SIZES, LnxButton } from '../../packages/components/src';
import { LnxIcon } from '../../packages/components/src/icon';

defineProps<{
	props: Record<string, ComponentProp>,
	hideType?: boolean,
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

function updateFromArrayInputValue(event: InputEvent, prop: ComponentProp) {
	const value = (event.target as HTMLInputElement).value;
	prop.value = value.split(',').map(v => v.trim());
}

function canShowAllVariations(prop: ComponentProp): boolean {
	return ['select', 'options', 'switch'].includes(prop.controlType);
}
</script>

<template>
	<div
		v-for="(prop, name) in props"
		:key="name"
		class="prop"
	>
		<div class="prop-data">
			<span class="name">
				{{ name }}
				<code
					v-if="prop.type && !hideType"
					class="type"
				>
					<a
						v-if="typeof prop.type === 'string'"
						:href="`#${prop.type.toLowerCase()}`"
					>
						{{ prop.type }}
					</a>
					<a
						v-else
						:href="prop.type.link"
						target="_blank"
					>
						{{ prop.type.name }}
					</a>
				</code>
			</span>

			<span
				class="description"
				v-html="prop.description"
			/>

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
				<!-- Select -->
				<select
					v-if="prop.controlType === 'select'"
					class="type-select"
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

				<!-- Switch -->
				<div
					v-else-if="prop.controlType === 'switch'"
					class="type-switch"
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

				<!-- Options -->
				<div
					v-else-if="prop.controlType === 'options'"
					class="type-options"
				>
					<label
						v-for="(option, index) in prop.options"
						:key="index"
					>
						<input
							v-model="prop.value"
							type="radio"
							:name="name"
							:value="option"
							:checked="prop.value === option"
							:disabled="showcasedProp === name"
						>
						{{ option }}
					</label>
				</div>

				<!-- Input & Number -->
				<input
					v-else-if="['input', 'number'].includes(prop.controlType)"
					class="type-input"
					:type="prop.controlType"
					:value="prop.value"
					:disabled="showcasedProp === name"
					@input="updateFromInputValue($event as InputEvent, prop)"
				>

				<!-- Array input -->
				<template v-else-if="prop.controlType === 'input-array'">
					<input
						class="type-input"
						:type="prop.controlType"
						:value="JSON.stringify(prop.value)"
						:disabled="showcasedProp === name"
						@input="updateFromArrayInputValue($event as InputEvent, prop)"
					>

					<span
						v-if="!prop.helper && prop.controlType === 'input-array'"
						class="helper"
					>
						<LnxIcon
							icon="mdi:information"
							:size="14"
							style="margin-bottom: -3px"
						/>
						Add values to the array by separating them with commas.
					</span>
				</template>

				<span
					v-if="prop.helper"
					class="helper"
				>
					<LnxIcon
						icon="mdi:information"
						:size="14"
						style="margin-bottom: -3px"
					/>
					{{ prop.helper }}
				</span>
			</div>

			<LnxButton
				v-if="!prop.hideAllVariationsButton && canShowAllVariations(prop)"
				:mode="BUTTON_MODES.CLEAR"
				:size="BUTTON_SIZES.SMALL"
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
			font-family: var(--lnx-font-family-mono), monospace;

			.type {
				font-size: var(--lnx-font-size-legal);
				font-weight: normal;
				padding: 4px;
			}
		}

		.description {
			:deep(code) {
				display: inline;
				padding: 4px;
				color: var(--vp-code-color);
				line-height: 1;
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
			text-wrap: nowrap;

			code {
				font-size: var(--lnx-font-size-legal);
				font-weight: normal;
				padding: 4px;
				text-wrap: wrap;
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
			display: flex;
			flex-direction: column;
			gap: 4px;

			select,
			input:not([type='radio']) {
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

			.type-select {
				-webkit-appearance: none;
				-moz-appearance: none;
				appearance: none;
				background: url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>") no-repeat;
				background-position-x: 100%;
				background-position-y: 5px;
			}

			.type-switch {
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

			.type-options {
				display: flex;
				gap: 8px;

				label {
					border-radius: 4px;
					border: 1px solid var(--vp-code-bg);
					padding: 0 4px;
					font-size: var(--lnx-font-size-small);
					position: relative;
					background: var(--vp-code-bg);
					cursor: pointer;
					min-width: 24px;
					display: flex;
					align-items: center;
					justify-content: center;

					&:has(:checked) {
						background: var(--lnx-color-primary);
						color: var(--lnx-color-primary-accent);
					}

					input {
						position: absolute;
						inset: 0;
					}
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