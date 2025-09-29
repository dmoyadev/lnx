<script setup lang="ts">
import { computed, onMounted, useAttrs, useTemplateRef } from 'vue';

const modelValue = defineModel<string>();

const props = withDefaults(defineProps<{
	hasError?: boolean; /* Indicates if it should show the error slot */
	length?: number; /* Number of digits of the input */
	isLoading?: boolean; /* When loading, it is disabled and shows a different content */
}>(), { length: 6 });

defineSlots<{
	default(): unknown; /* The label of the input */
	helper(): unknown; /* The helper message of the input */
	error(): unknown; /* The error message of the input */
}>();

const _componentUID = Date.now().toString(36) + Math.random().toString(36).substring(2);

const $attrs = useAttrs();
const isDisabled = computed(() => props.isLoading || !!('disabled' in $attrs && ($attrs.disabled || $attrs.disabled === '')));

const $inputs = useTemplateRef<HTMLInputElement[]>('$inputs');

function _setDigit(index: number, value: string) {
	$inputs.value![index].value = value;
	modelValue.value = $inputs.value!.map(input => input.value).join('');
}

function handleInput(event: Event, index: number) {
	const value = (event as InputEvent).data;

	if (!!value && /^[0-9]$/.test(value)) {
		_setDigit(index - 1, value);

		if (index < props.length) {
			$inputs.value![index].focus();
		}
	}
}

function handleDelete(index: number) {
	// If the current input has a value, clear it and stay
	const input = $inputs.value![index - 1];
	if(input.value !== '') {
		_setDigit(index - 1, '');
		if(index > 1) {
			$inputs.value![index - 1].focus();
		}
		return;
	}

	// If the current input is empty, move to the previous input and clear it
	if (index < 2) { return; }

	_setDigit(index - 2, '');
	$inputs.value![index - 2].focus();
}

function handlePaste(event: ClipboardEvent) {
	const pastedData = event.clipboardData?.getData('text/plain');
	if(!pastedData) { return; }

	const digits = pastedData.replace(/\D/g, '').slice(0, props.length).split('');
	digits.forEach((digit, index) => {
		_setDigit(index, digit);
	});

	// Focus the next empty input
	if (digits.length <= props.length) {
		$inputs.value![digits.length].focus();
	}
}

function handleArrow(newFocusedIndex: number) {
	$inputs.value![newFocusedIndex - 1].focus();
}

onMounted(() => {
	// Initialize the inputs with the modelValue if it exists
	if (!modelValue.value) { return; }
	const digits = modelValue.value.toString().slice(0, props.length).split('');
	digits.forEach((digit, index) => {
		_setDigit(index, digit);
	});
});
</script>

<template>
	<div
		class="input-otp"
		:class="{ 'has-error': hasError }"
		@paste.prevent="handlePaste($event)"
	>
		<!-- Label -->
		<label
			v-if="!!$slots.default"
			class="label"
			:for="`otp-digit-1-${_componentUID}`"
		>
			<!-- @slot Label of the input -->
			<slot />
		</label>

		<div class="digits">
			<!-- Hidden input for accessibility and autofill -->
			<input
				:id="`otp-${_componentUID}`"
				v-model="modelValue"
				autocomplete="one-time-code"
				type="text"
				inputmode="numeric"
				class="sr-only"
			>

			<input
				v-for="index in props.length"
				:id="`otp-digit-${index}-${_componentUID}`"
				:key="index"
				ref="$inputs"
				:value="modelValue?.toString()[index - 1] || ''"
				type="number"
				inputmode="numeric"
				:autofocus="index === 1"
				step="1"
				min="0"
				max="9"
				required
				:disabled="isDisabled"
				:aria-label="`OTP digit ${index}`"
				@input="handleInput($event, index)"
				@keydown.delete="handleDelete(index)"
				@keydown.left.prevent="handleArrow(index - 1)"
				@keydown.right.prevent="handleArrow(index + 1)"
			>
		</div>

		<!-- Helper slot -->
		<p
			v-if="!!$slots.helper"
			class="helper"
		>
			<slot name="helper" />
		</p>

		<!-- Error slot -->
		<p
			v-if="!isLoading && hasError"
			class="error"
		>
			<slot name="error" />
		</p>
	</div>
</template>

<style scoped lang="scss">
.input-otp {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--lnx-spacing-1);

	&:has(input:read-only),
	&:has(input:disabled) {
		opacity: .5;
	}

	&.has-error {
		@keyframes shake {
			0% { transform: translateX(0); }
			25% { transform: translateX(0.5rem); }
			75% { transform: translateX(-0.5rem); }
			100% { transform: translateX(0); }
		}

		input,
		input:invalid {
			background: var(--lnx-color-danger-bg);
			animation: shake 0.2s ease-in-out 0s 2;

			&:focus {
				background: var(--lnx-color-danger-bg-accent);
			}
		}
	}

	label {
		font-size: var(--lnx-font-size-small);
	}

	.digits {
		display: flex;
		gap: var(--lnx-spacing-2);

		input {
			width: 40px;
			height: 40px;
			text-align: center;
			font-family: var(--lnx-font-family-mono), monospace;
			font-size: var(--lnx-font-size-bigger);
			border-radius: var(--lnx-radius-2);
			background: var(--lnx-color-gray-bg);

			&::-webkit-inner-spin-button {
				display: none;
			}

			&:focus {
				background: var(--lnx-color-gray-bg-accent);
				outline: none;
				box-shadow: var(--lnx-elevation-2);
			}
		}
	}

	.error {
		color: var(--lnx-color-danger);
		font-size: var(--lnx-font-size-small);
		line-height: var(--lnx-font-size-small);
		display: flex;
		align-items: center;
		gap: 4px;
		text-align: center;
	}

	.helper {
		color: var(--lnx-color-primary);
		font-size: var(--lnx-font-size-small);
		line-height: var(--lnx-font-size-small);
		display: flex;
		align-items: center;
		gap: 4px;
		text-align: center;
	}
}
</style>