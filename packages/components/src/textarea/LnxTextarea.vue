<script setup lang="ts">
import { computed, ref, useAttrs, useId, watchPostEffect } from 'vue';

const props = defineProps<{
	isLoading?: boolean; /* When loading, it is readonly and disabled */
	hasError?: boolean; /* Indicates if it should show the error slot */
	customValidity?: string; /* The error message of the textarea. It is the default value for the `error` slot */
	autoGrow?: boolean; /* Grows with the text, from `rows` up to `maxRows`. Where the browser has no `field-sizing`, it keeps its size */
	maxRows?: number; /* With `autoGrow`, the rows it grows up to before it scrolls */
	showCount?: boolean; /* With `maxlength`, shows how many characters are used, like 120/500 */
}>();

defineSlots<{
	default(): unknown; /* The label of the textarea */
	helper(): unknown; /* The helper message of the textarea */
	error(): unknown; /* The error message of the textarea */
}>();

const model = defineModel<string>();

// $attrs go to the <textarea>; only class and style stay on the wrapper
defineOptions({ inheritAttrs: false });

const $attrs = useAttrs();
const id = useId();
const textareaAttrs = computed(() => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { class: _class, style, ...rest } = $attrs;
	return rest;
});
const isReadonly = computed(() => props.isLoading || !!('readonly' in $attrs && ($attrs.readonly || $attrs.readonly === '')));
const isDisabled = computed(() => props.isLoading || !!('disabled' in $attrs && ($attrs.disabled || $attrs.disabled === '')));
const maxlength = computed(() => Number($attrs.maxlength ?? $attrs['max-length']) || undefined);
const rows = computed(() => Number($attrs.rows) || 2);

const $textarea = ref<HTMLTextAreaElement>();
defineExpose({ $textarea });
watchPostEffect(() => {
	$textarea.value?.setCustomValidity((props.hasError && props.customValidity) ? props.customValidity : '');
});
</script>

<template>
	<div
		class="lnx-textarea"
		:class="$attrs.class"
		:style="$attrs.style"
	>
		<label :class="{ 'has-error': hasError }">
			<span
				v-if="!!$slots.default"
				class="label"
			>
				<slot />
			</span>
			<textarea
				v-bind="textareaAttrs"
				:id="($attrs.id as string) || id"
				ref="$textarea"
				v-model="model"
				:class="{ 'is-auto-grow': autoGrow }"
				:style="{ '--lnx-textarea-rows': rows, '--lnx-textarea-max-rows': maxRows }"
				:readonly="isReadonly"
				:disabled="isDisabled"
			/>
		</label>

		<div
			v-if="!!$slots.helper || (showCount && maxlength)"
			class="footer"
		>
			<p
				v-if="!!$slots.helper"
				class="helper"
			>
				<slot name="helper" />
			</p>
			<!-- Screen readers get the limit from maxlength, so the count is only visual -->
			<span
				v-if="showCount && maxlength"
				class="count"
				aria-hidden="true"
			>{{ model?.length ?? 0 }}/{{ maxlength }}</span>
		</div>

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

.lnx-textarea {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: var(--lnx-control-gap);

	label {
		display: flex;
		flex-direction: column;
		gap: var(--lnx-control-gap);

		&:has(textarea:read-only, textarea:disabled) {
			opacity: .5;
		}

		&.has-error textarea {
			@include field.control-error;
		}
	}

	textarea {
		@include field.control;
		--lnx-textarea-line-height: 1.4;

		width: 100%;
		height: auto;
		padding: var(--lnx-spacing-1) var(--lnx-control-padding-x);
		font-family: inherit;
		line-height: var(--lnx-textarea-line-height);
		resize: vertical;

		&.is-auto-grow {
			field-sizing: content;
			min-height: calc(var(--lnx-textarea-rows) * 1lh + 2 * var(--lnx-spacing-1) + 2 * var(--lnx-control-border-width));
			max-height: calc(var(--lnx-textarea-max-rows, 1000) * 1lh + 2 * var(--lnx-spacing-1) + 2 * var(--lnx-control-border-width));
		}
	}

	.footer {
		display: flex;
		align-items: flex-start;
		gap: var(--lnx-spacing-2);

		.helper {
			flex: 1;
		}
	}

	.count {
		margin-left: auto;
		color: var(--lnx-color-text-muted);
		font-size: var(--lnx-font-size-small);
		line-height: var(--lnx-font-size-small);
		font-variant-numeric: tabular-nums;
	}
}
</style>
