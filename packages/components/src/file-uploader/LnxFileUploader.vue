<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue';
import { LnxIcon } from '../icon';
import { BUTTON_MODES, BUTTON_SIZES, BUTTON_VARIANTS, LnxButton } from '../button';

const modelValue = defineModel<File[]>();

const props = defineProps<{
	fileUrls?: string[]; /* When a file is uploaded, the url to it */
	isLoading?: boolean; /* When loading, it is disabled */
	hasError?: boolean; /* Indicates if it should show the error slot */
	customValidity?: string; /* The error message of the input. It is the default value for the `error` slot */
}>();

defineSlots<{
	default(): unknown; /* The label of the input */
	helper(): unknown; /* The helper message of the input */
	error(): unknown; /* The error message of the input */
	textWaitingState(): unknown; /* Text to be shown when idle */
	textDraggedOverState(): unknown; /* Text to be shown when a file is being dragged over the component */
}>();

const _componentUID = Date.now().toString(36) + Math.random().toString(36).substring(2);

const $attrs = useAttrs();
const isMultiple = computed(() => !!('multiple' in $attrs && ($attrs.multiple || $attrs.multiple === 'true')));
const isDisabled = computed(() =>  props.isLoading || !!('disabled' in $attrs && ($attrs.disabled || $attrs.disabled === '')));

const $input = ref<HTMLInputElement>();
defineExpose({ $input }); // Components outside this one can see and use this ref
watch(() => props.hasError, (value) => {
	$input.value?.setCustomValidity((value && props.customValidity) ? props.customValidity : '');
});

const isDragging = ref(false);

function upload(event: Event) {
	const files = (event.target as HTMLInputElement)?.files;
	if(!files) {
		return;
	}

	modelValue.value = Array.from(files);
}

function getIcon(): string {
	if(isDragging.value) {
		return 'mdi:folder-open';
	}

	if(isMultiple.value) {
		return 'mdi:folder-multiple';
	}

	return 'mdi:folder';
}
</script>

<template>
	<div class="file-uploader">
		<!-- Empty and uploading states -->
		<label
			:class="{ 'has-error': hasError }"
			@dragover="isDragging = true"
			@dragenter="isDragging = true"
			@dragleave="isDragging = false"
			@dragend="isDragging = false"
			@drop="isDragging = false"
		>
			<input
				:id="($attrs.id as string) || _componentUID"
				ref="$input"
				v-bind="$attrs"
				:disabled="isDisabled"
				aria-label=""
				type="file"
				@change="upload($event)"
			>

			<!-- Label -->
			<span
				v-if="!!$slots.default"
				class="label"
			>
				<!-- @slot Label of the input -->
				<slot />
			</span>

			<span
				v-if="!modelValue?.length"
				class="box"
				:class="{ 'is-dragover': isDragging }"
			>
				<small class="box-text">
					<span>
						<LnxIcon
							:size="32"
							:icon="getIcon()"
						/>
					</span>

					<span v-if="!isDragging">
						<!-- @slot Text to be shown when idle -->
						<slot name="textWaitingState">Drop a file or click</slot>
					</span>
					<span v-else>
						<!-- @slot Text to be shown when a file is being dragged over the component -->
						<slot name="textDraggedOverState">Drop it!</slot>
					</span>
				</small>
			</span>
		</label>

		<!-- With file state -->
		<div
			v-for="(file, index) in modelValue || []"
			:key="file?.name"
			class="file"
			:class="{ 'single': modelValue?.length === 1 }"
		>
			<div class="file-info">
				<LnxButton
					class="btn-clear"
					:mode="BUTTON_MODES.CLEAR"
					:variant="BUTTON_VARIANTS.GRAYSCALE"
					:size="BUTTON_SIZES.SMALL"
					@click="modelValue?.splice(index, 1)"
				>
					<LnxIcon icon="mdi:times" />
				</LnxButton>

				<LnxIcon
					:size="24"
					icon="mdi:file"
				/>

				<!-- @slot Text to be shown for the delete button -->
				<a
					:href="fileUrls?.[index] || '#'"
					target="_blank"
				>
					<template v-if="file!.name">{{ file!.name }}</template>
					<template v-else-if="$attrs.name">{{ $attrs.name }}</template>
					<LnxIcon
						:size="12"
						icon="mdi:external-link"
					/>
				</a>
			</div>
		</div>

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
.file-uploader {
	display: flex;
	flex-direction: column;
	gap: var(--lnx-spacing-1);
	width: 100%;

	--file-uploader-height: 64px;

	label {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;

		&:has(input:disabled) {
			opacity: .5;
		}

		&:focus,
		&:focus-within {
			.box {
				border: 1px dashed var(--lnx-color-primary);
			}
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

			&:not(:has(:disabled)):focus-within input {
				border-color: var(--lnx-color-primary);
			}

			.box {
				border-color: var(--lnx-color-danger);
				animation: shake 0.2s ease-in-out 0s 2;
			}
		}

		.label {
			font-size: var(--lnx-font-size-small);
		}

		input {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
			z-index: 100;

			&:not(:disabled) {
				cursor: pointer;
			}
		}

		.box {
			position: relative;
			display: flex;
			align-items: center;
			width: 100%;
			padding: 20px;
			height: var(--file-uploader-height);
			border: 1px dashed var(--lnx-color-gray-5);
			border-radius: var(--lnx-radius-2);

			.box-text {
				margin: 0;
				width: 100%;
				text-align: center;
				font-weight: normal;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			}

			&.is-dragover {
				padding: 21px;
				border: 1px dashed var(--lnx-color-primary-light);

				.box-text {
					span:not(.label) {
						font-weight: bold;
					}

					.icon {
						color: var(--panda-color-primary-5);
					}
				}
			}
		}
	}

	.file {
		display: flex;
		align-items: center;
		gap: var(--lnx-spacing-4);
		min-height: calc(calc(var(--file-uploader-height) - 2px) / 2);

		&.single {
			height: calc(var(--file-uploader-height) - 2px);
		}

		.file-info {
			display: flex;
			align-items: center;
			gap: var(--lnx-spacing-1);

			a {
				display: flex;
				align-items: center;
				gap: var(--lnx-spacing-1);
				font-size: var(--lnx-font-size-small);
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
</style>