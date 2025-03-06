<script lang="ts" setup>
import { computed, ref, useAttrs, watch } from 'vue';
import { LnxIcon } from '../icon';
import { LnxButton, ButtonModes, ButtonShapes, ButtonSizes } from '../button';

const props = defineProps<{
	isClearable?: boolean; /* Indicates if a button should render to quickly clear the input */
	isLoading?: boolean; /* When loading, it is disabled and shows a different content */
	hasError?: boolean; /* Indicates if it should show the error slot */
	customValidity?: string; /* The error message of the input. It is the default value for the `error` slot */
}>();

const modelValue = defineModel<string | number>();

const _componentUID = Date.now().toString(36) + Math.random().toString(36).substring(2);

const $attrs = useAttrs();
const inputType = computed<string>(() => $attrs.type as string ?? 'text');
const isReadonly = computed(() => props.isLoading || !!('readonly' in $attrs && ($attrs.readonly || $attrs.readonly === '')));
const isDisabled = computed(() => props.isLoading || !!('disabled' in $attrs && ($attrs.disabled || $attrs.disabled === '')));

const $input = ref<HTMLInputElement>();
defineExpose({ $input }); // Components outside this one can see and use this ref
watch(() => props.hasError, (value) => {
	$input.value?.setCustomValidity((value && props.customValidity) ? props.customValidity : '');
});

const showPassword = ref(false);
</script>

<template>
	<div>
		<label
			:class="{
				'has-value': !!modelValue,
				'has-error': hasError,
			}"
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
					v-bind="$attrs"
					:type="showPassword ? 'text' : inputType"
					:readonly="isReadonly"
					:disabled="isDisabled"
					aria-label=""
					@input="modelValue = ($event.target as HTMLInputElement).value"
				>

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
						:mode="ButtonModes.CLEAR"
						:size="ButtonSizes.SMALL"
						:shape="ButtonShapes.ICON"
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
							:mode="ButtonModes.CLEAR"
							:shape="ButtonShapes.ICON"
							:size="ButtonSizes.SMALL"
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
div {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	gap: 4px;

	label {
		position: relative;

		&:has(input:read-only),
		&:has(input:disabled) {
			opacity: .5;
		}

		&.has-error {
			@keyframes shake {
				0% {
					transform: translateX(0);
				}
				25% {
					transform: translateX(0.5rem);
				}
				75% {
					transform: translateX(-0.5rem);
				}
				100% {
					transform: translateX(0);
				}
			}

			.label {
				color: var(--lnx-color-danger);
			}

			input,
			input:invalid {
				border-color: var(--lnx-color-danger) !important;
				animation: shake 0.2s ease-in-out 0s 2;
			}

			&:not(:has(:disabled)):focus-within input {
				border-color: var(--lnx-color-primary);
			}
		}

		&:not(:has(:disabled)):focus-within,
		&.has-value {
			&:has(.btn-icon) {
				input {
					padding-right: 40px;
				}
			}

			&:has(.icon) {
				input {
					padding-right: 36px;
				}
			}

			&:has(.icon):has(.btn-icon) {
				input {
					padding-right: 70px;
				}
			}

			&:has(.icon):has(.btn-icon:only-child) {
				input {
					padding-right: 40px;
				}
			}
		}

		.label {
			font-size: var(--lnx-font-size-small);
		}

		.input-wrapper {
			position: relative;
			width: 100%;

			input {
				height: 32px;
				width: 100%;
				border: 1px solid var(--lnx-color-gray-8);
				border-radius: 4px;
				padding: 12px;
				font-size: var(--lnx-font-size-body);

				&::-webkit-inner-spin-button,
				&::-webkit-outer-spin-button {
					-webkit-appearance: revert;
					margin-right: -4px;
				}
			}

			.icon {
				display: flex;
				align-items: center;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 8px;
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
	}

	.helper {
		color: var(--lnx-color-primary);
		font-size: var(--lnx-font-size-small);
		line-height: var(--lnx-font-size-small);
		display: flex;
		align-items: center;
		gap: 4px;
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

