<script setup lang="ts" generic="T">
import { computed, ref, useAttrs, useId, watchPostEffect } from 'vue';
import { LnxIcon } from '../icon';

const props = defineProps<{
	isLoading?: boolean; /* When loading, it is disabled and shows a spinner in the box */
	hasError?: boolean; /* Indicates if it should show the error slot */
	customValidity?: string; /* The error message of the checkbox. It is the default value for the `error` slot */
	indeterminate?: boolean; /* Shows a dash instead of a check, for a group partly checked. It's read out as "mixed" */
}>();

defineSlots<{
	default(): unknown; /* The label of the checkbox */
	helper(): unknown; /* The helper message of the checkbox */
	error(): unknown; /* The error message of the checkbox */
}>();

/* A boolean, or an array to add and remove the `value` of the checkbox, like a native one */
const model = defineModel<boolean | T[]>();

// $attrs go to the <input>; only class and style stay on the wrapper
defineOptions({ inheritAttrs: false });

const $attrs = useAttrs();
const id = useId();
const inputAttrs = computed(() => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { class: _class, style, ...rest } = $attrs;
	return rest;
});
const isDisabled = computed(() => props.isLoading || !!('disabled' in $attrs && ($attrs.disabled || $attrs.disabled === '')));

const $input = ref<HTMLInputElement>();
defineExpose({ $input });
watchPostEffect(() => {
	$input.value?.setCustomValidity((props.hasError && props.customValidity) ? props.customValidity : '');
});
</script>

<template>
	<div
		class="lnx-checkbox"
		:class="$attrs.class"
		:style="$attrs.style"
	>
		<label :class="{ 'has-error': hasError }">
			<span class="box">
				<input
					v-bind="inputAttrs"
					:id="($attrs.id as string) || id"
					ref="$input"
					v-model="model"
					type="checkbox"
					:indeterminate
					:disabled="isDisabled"
				>
				<LnxIcon
					class="check"
					:class="{ 'is-loading': isLoading }"
					:icon="isLoading ? 'line-md:loading-loop' : (indeterminate ? 'lucide:minus' : 'lucide:check')"
					:size="12"
				/>
			</span>
			<span
				v-if="!!$slots.default"
				class="text"
			>
				<slot />
			</span>
		</label>

		<p
			v-if="!!$slots.helper"
			class="helper"
		>
			<slot name="helper" />
		</p>

		<p
			v-if="!isLoading && hasError"
			class="error"
		>
			<slot name="error">
				{{ customValidity }}
			</slot>
		</p>
	</div>
</template>

<style scoped lang="scss">
@use '../field';

.lnx-checkbox {
	display: flex;
	flex-direction: column;
	gap: var(--lnx-control-gap);

	label {
		display: inline-flex;
		align-items: flex-start;
		gap: var(--lnx-spacing-2);
		font-size: var(--lnx-control-font-size);
		line-height: 1.4;
		cursor: pointer;

		&:has(input:disabled) {
			opacity: .5;
			cursor: default;
		}

		&.has-error {
			.text {
				color: var(--lnx-color-danger);
			}

			input {
				border-color: var(--lnx-color-danger);
			}
		}
	}

	/* As tall as a line of the label, so the box sits on the first line when the label wraps */
	.box {
		position: relative;
		height: 1lh;
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
	}

	input {
		width: 18px;
		height: 18px;
		margin: 0;
		border: var(--lnx-control-border-width) solid var(--lnx-color-border);
		border-radius: var(--lnx-radius-2);
		background: transparent;
		appearance: none;
		cursor: inherit;
		transition: background .15s, border-color .15s;

		&:checked,
		&:indeterminate {
			border-color: var(--lnx-color-primary);
			background: var(--lnx-color-primary);
		}

		&:focus-visible {
			outline: 2px solid var(--lnx-color-primary);
			outline-offset: 1px;
		}
	}

	.check {
		position: absolute;
		inset: 0;
		margin: auto;
		width: 12px;
		height: 12px;
		color: var(--lnx-color-primary-accent);
		opacity: 0;
		pointer-events: none;
		transition: opacity .15s;
	}

	input:is(:checked, :indeterminate) + .check {
		opacity: 1;
	}

	/* The spinner shows on an empty box too */
	.check.is-loading {
		opacity: 1;
	}

	input:not(:checked, :indeterminate) + .check.is-loading {
		color: var(--lnx-color-text);
	}
}
</style>
