<script lang="ts" setup>
import { computed, ref, useAttrs, watchPostEffect } from 'vue';
import { LnxIcon } from '../icon';
import { LnxButton, BUTTON_MODES, BUTTON_SHAPES } from '../button';

const props = withDefaults(defineProps<{
	isClearable?: boolean; /* Indicates if a button should render to quickly clear the input */
	isLoading?: boolean; /* When loading, it is disabled and shows different content */
	hasError?: boolean; /* Indicates if it should show the error slot */
	customValidity?: string; /* The error message of the input. It is the default value for the `error` slot */
}>(), { customValidity: undefined });

defineSlots<{
	default(): unknown; /* The label of the input */
	helper(): unknown; /* The helper message of the input */
	error(): unknown; /* The error message of the input */
	icon(): unknown; /* The icon shown on the right side of the input */
	overlay(): unknown; /* Content laid over the input box, like the selected option of a select */
}>();

const modelValue = defineModel<string | number>();

// $attrs go to the <input>; only class and style stay on the wrapper, so listeners don't fire twice
defineOptions({ inheritAttrs: false });

const _componentUID = Date.now().toString(36) + Math.random().toString(36).substring(2);

const $attrs = useAttrs();
const inputAttrs = computed(() => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { class: _class, style, ...rest } = $attrs;
	return rest;
});
const inputType = computed<string>(() => $attrs.type as string ?? 'text');
const isReadonly = computed(() => props.isLoading || !!('readonly' in $attrs && ($attrs.readonly || $attrs.readonly === '')));
const isDisabled = computed(() => props.isLoading || !!('disabled' in $attrs && ($attrs.disabled || $attrs.disabled === '')));

const $input = ref<HTMLInputElement>();
defineExpose({ $input }); // Components outside this one can see and use this ref
// Post effect: runs once the input exists and again when hasError or customValidity change
watchPostEffect(() => {
	$input.value?.setCustomValidity((props.hasError && props.customValidity) ? props.customValidity : '');
});

const showPassword = ref(false);
</script>

<template>
	<div
		class="input"
		:class="$attrs.class"
		:style="$attrs.style"
	>
		<label
			:class="{ 'has-error': hasError }"
		>
			<!-- Label -->
			<span
				v-if="!!$slots.default"
				class="label"
			>
				<!-- @slot Label of the input -->
				<slot />
			</span>

			<span class="input-wrapper">
				<!-- Actual input -->
				<input
					:id="($attrs.id as string) || _componentUID"
					ref="$input"
					v-model="modelValue"
					v-bind="inputAttrs"
					:type="showPassword ? 'text' : inputType"
					:readonly="isReadonly"
					:disabled="isDisabled"
					aria-label=""
					@input="modelValue = ($event.target as HTMLInputElement).value"
				>

				<!-- @slot Content laid over the input box, whatever the label and messages around it -->
				<slot name="overlay" />

				<!-- Icon right -->
				<span
					v-if="$slots.icon
						|| isLoading
						|| (isClearable && !!modelValue)
						|| ['search', 'password', 'email', 'tel'].includes(inputType)"
					class="icon"
				>
					<!-- Clearable button -->
					<LnxButton
						v-if="isClearable
							&& !!modelValue
							&& !isLoading
							&& inputType !== 'password'
							&& !isLoading 
							&& !isDisabled
						"
						:mode="BUTTON_MODES.CLEAR"
						:shape="BUTTON_SHAPES.ICON"
						type="button"
						class="btn-icon"
						@click="modelValue = inputType === 'number' ? 0 : ''"
					>
						<LnxIcon icon="mdi:clear" />
					</LnxButton>

					<!-- @slot Element shown on the inside right of the input -->
					<slot
						v-if="!isLoading"
						name="icon"
					>
						<!-- Email icon -->
						<LnxIcon
							v-if="inputType === 'email'"
							icon="mdi:email"
						/>

						<!-- Telephone icon -->
						<LnxIcon
							v-if="inputType === 'tel'"
							icon="mdi:phone"
						/>

						<!-- Search icon -->
						<LnxIcon
							v-if="inputType === 'search'"
							icon="mdi:search"
						/>

						<!-- Toggle password visibility button -->
						<LnxButton
							v-if="inputType === 'password'"
							:mode="BUTTON_MODES.CLEAR"
							:shape="BUTTON_SHAPES.ICON"
							:disabled="isDisabled || isLoading"
							type="button"
							class="btn-icon"
							@click="showPassword = !showPassword"
						>
							<LnxIcon :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'" />
						</LnxButton>
					</slot>

					<LnxIcon
						v-else-if="isLoading"
						icon="line-md:loading-loop"
					/>
				</span>
			</span>
		</label>

		<!-- Helper slot -->
		<p
			v-if="!!$slots.helper"
			class="helper"
		>
			<!-- @slot Helper message of the input -->
			<slot name="helper" />
		</p>

		<!-- Error slot -->
		<p
			v-if="!isLoading && hasError"
			class="error"
		>
			<!-- @slot Error message of the input. Defaults to the customValidity prop -->
			<slot name="error">
				{{ customValidity }}
			</slot>
		</p>
	</div>
</template>

<style scoped lang="scss">
@use '../field';

.input {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	gap: var(--lnx-control-gap);

	label {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--lnx-control-gap);

		&:has(input:read-only),
		&:has(input:disabled) {
			opacity: .5;
		}

		&.has-error .input-wrapper input {
			@include field.control-error;
		}

		.input-wrapper {
			position: relative;
			width: 100%;

			input {
				@include field.control;
				width: 100%;

				&::-webkit-inner-spin-button,
				&::-webkit-outer-spin-button {
					-webkit-appearance: revert;
					margin-right: -4px;
				}
			}

			// Leave room for the icon so the text never runs under it
			&:has(.icon) input {
				padding-right: calc(var(--lnx-control-padding-x) + 1.4em + var(--lnx-spacing-1));
			}

			&:has(.btn-icon) input {
				padding-right: calc(var(--lnx-control-padding-x) + var(--lnx-control-height) + var(--lnx-spacing-1));
			}

			.icon {
				display: flex;
				align-items: center;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: var(--lnx-control-padding-x);
			}
		}
	}
}

/* Delete search clear x */
/* clears the ‘X’ from Chrome */
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
	display: none;
}
</style>
