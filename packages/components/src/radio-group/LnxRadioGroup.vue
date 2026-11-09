<script setup lang="ts" generic="T">
import { useId } from 'vue';
import { LnxIcon } from '../icon';
import { RADIO_GROUP_MODES } from './types';
import type { RadioGroupMode, RadioGroupOption } from './types';

const props = withDefaults(defineProps<{
	options: RadioGroupOption<T>[]; /* The options to pick from */
	mode?: RadioGroupMode; /* Pills that wrap, a joined block for 2 to 4 options, or classic radios in a column */
	multiple?: boolean; /* Checkboxes instead of radios: several can be picked and v-model is an array */
	name?: string; /* Name of the inputs in a form. By default, a unique one, so the arrows move between the options */
	hideLegend?: boolean; /* Hides the legend, the default slot, but screen readers still read it */
	isBlock?: boolean; /* Takes the whole width of its container */
	required?: boolean; /* A radio must be picked to submit the form */
}>(), {
	mode: RADIO_GROUP_MODES.CHIPS,
	name: undefined,
});

defineSlots<{
	default(): unknown; /* The legend of the group: what the options answer */
	option(props: { option: RadioGroupOption<T>; checked: boolean }): unknown; /* Content of each option, instead of its icon and label */
}>();

/* The value of the picked option, or the values of the picked ones with `multiple` */
const model = defineModel<T | T[]>();

const fallbackName = useId();

function isChecked(option: RadioGroupOption<T>) {
	return props.multiple && Array.isArray(model.value) ? model.value.includes(option.value) : model.value === option.value;
}
</script>

<template>
	<fieldset
		class="lnx-radio-group"
		:class="[`radio-group-mode-${mode}`, { 'is-block': isBlock }]"
	>
		<legend
			v-if="!!$slots.default"
			:class="{ 'is-hidden': hideLegend }"
		>
			<slot />
		</legend>

		<div class="options">
			<label
				v-for="option in options"
				:key="String(option.value)"
				class="option"
				:class="{ 'is-checked': isChecked(option) }"
			>
				<input
					v-model="model"
					:type="multiple ? 'checkbox' : 'radio'"
					:name="name ?? fallbackName"
					:value="option.value"
					:disabled="option.disabled"
					:required="required && !multiple"
				>
				<slot
					name="option"
					:option
					:checked="isChecked(option)"
				>
					<LnxIcon
						v-if="option.icon"
						:icon="option.icon"
						:size="16"
					/>
					<span>{{ option.label }}</span>
				</slot>
			</label>
		</div>
	</fieldset>
</template>

<style scoped lang="scss">
.lnx-radio-group {
	min-width: 0;
	margin: 0;
	padding: 0;
	border: none;
	display: flex;
	flex-direction: column;
	gap: var(--lnx-control-gap);

	&:disabled {
		opacity: .5;
	}

	legend {
		padding: 0;
		margin-bottom: var(--lnx-control-gap);
		font-size: var(--lnx-font-size-small);

		&.is-hidden {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
	}

	.options {
		display: flex;
		flex-wrap: wrap;
		gap: var(--lnx-spacing-2);
	}

	.option {
		display: inline-flex;
		align-items: center;
		gap: var(--lnx-spacing-1);
		font-size: var(--lnx-control-font-size);
		cursor: pointer;

		&:has(input:disabled) {
			opacity: .5;
			cursor: default;
		}
	}

	/* Chips and segmented: the input is hidden but still focusable, so the keyboard and forms work as native */
	&:not(.radio-group-mode-list) {
		.option {
			position: relative;
			height: var(--lnx-control-height);
			padding: 0 var(--lnx-control-padding-x);
			justify-content: center;
			border: var(--lnx-control-border-width) solid var(--lnx-color-border);
			color: var(--lnx-color-text);
			white-space: nowrap;
			transition: background .15s, border-color .15s, color .15s;

			&:hover:not(:has(input:disabled)) {
				background: var(--lnx-color-gray-bg);
			}

			&.is-checked {
				border-color: var(--lnx-color-primary);
				background: var(--lnx-color-primary);
				color: var(--lnx-color-primary-accent);
			}

			&:has(input:focus-visible) {
				outline: 2px solid var(--lnx-color-primary-light);
				outline-offset: 2px;
				z-index: 1;
			}
		}

		input {
			position: absolute;
			inset: 0;
			margin: 0;
			opacity: 0;
			pointer-events: none;
		}
	}

	&.radio-group-mode-chips .option {
		border-radius: var(--lnx-radius-5);
	}

	&.radio-group-mode-segmented {
		align-items: flex-start;

		&.is-block {
			align-items: stretch;
		}

		.options {
			flex-wrap: nowrap;
			gap: 0;
		}

		.option {
			flex: 1;
			border-radius: 0;

			&:not(:first-child) {
				margin-left: calc(-1 * var(--lnx-control-border-width));
			}

			&:first-child {
				border-radius: var(--lnx-control-radius) 0 0 var(--lnx-control-radius);
			}

			&:last-child {
				border-radius: 0 var(--lnx-control-radius) var(--lnx-control-radius) 0;
			}
		}
	}

	&.radio-group-mode-list {
		.options {
			flex-direction: column;
		}

		input {
			width: 16px;
			height: 16px;
			margin: 0;
			appearance: auto;
			accent-color: var(--lnx-color-primary);
		}
	}
}

@media (prefers-reduced-motion: reduce) {
	.lnx-radio-group .option {
		transition: none;
	}
}
</style>
