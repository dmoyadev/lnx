<script setup lang="ts">
import { computed, ref, useAttrs, watchPostEffect } from 'vue';
import { UploadedFile } from './types';
import { LnxIcon } from '../icon';
import { BUTTON_MODES, BUTTON_VARIANTS, LnxButton } from '../button';

const props = defineProps<{
	files?: UploadedFile[]; /* Files uploaded */
	isUploading?: boolean; /* When uploading, it is disabled */
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
	textUploading(): unknown; /* Text to be shown when a file is being uploaded */
}>();

const emit = defineEmits<{
	upload: [file: File[]] /* When a file is added to the input */
	delete: [file: UploadedFile] /* When a file needs to be removed */
}>();

// $attrs go to the <input>; only class and style stay on the wrapper, so listeners don't fire twice
defineOptions({ inheritAttrs: false });

const _componentUID = Date.now().toString(36) + Math.random().toString(36).substring(2);

const $attrs = useAttrs();
const inputAttrs = computed(() => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { class: _class, style, ...rest } = $attrs;
	return rest;
});
const isMultiple = computed(() => !!('multiple' in $attrs && ($attrs.multiple || $attrs.multiple === 'true')));
const isDisabled = computed(() =>  props.isLoading || props.isUploading || !!('disabled' in $attrs && ($attrs.disabled || $attrs.disabled === '')));

const $input = ref<HTMLInputElement>();
defineExpose({ $input }); // Components outside this one can see and use this ref
// Post effect: runs once the input exists and again when hasError or customValidity change
watchPostEffect(() => {
	$input.value?.setCustomValidity((props.hasError && props.customValidity) ? props.customValidity : '');
});

const isDragging = ref(false);

function upload(event: Event) {
	const files = (event.target as HTMLInputElement)?.files;
	if(!files) {
		return;
	}

	emit('upload', Array.from(files));
}

function getIcon(): string {
	if(isDragging.value) {
		return 'mdi:folder-open';
	}

	if(isMultiple.value) {
		return 'mdi:folder-multiple';
	}

	if(props.isUploading) {
		return 'line-md:loading-twotone-loop';
	}

	return 'mdi:folder';
}
</script>

<template>
	<div
		class="file-uploader"
		:class="$attrs.class"
		:style="$attrs.style"
	>
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
				v-bind="inputAttrs"
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
				v-if="!files?.length"
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

					<span v-if="!isDragging && !isUploading">
						<slot name="textWaitingState">Drop a file or click</slot>
					</span>
					<span v-else-if="!isUploading">
						<slot name="textDraggedOverState">Drop it!</slot>
					</span>
					<span v-else>
						<slot name="textUploading">Uploading...</slot>
					</span>
				</small>
			</span>
		</label>

		<!-- With file state -->
		<div
			v-for="(file, index) in files || []"
			:key="file.name || index"
			class="file"
			:class="{ 'single': files?.length === 1 }"
		>
			<div class="file-info">
				<LnxButton
					class="btn-clear"
					:mode="BUTTON_MODES.CLEAR"
					:variant="BUTTON_VARIANTS.GRAYSCALE"
					@click="$emit('delete', file)"
				>
					<LnxIcon icon="mdi:times" />
				</LnxButton>

				<LnxIcon
					:size="24"
					icon="mdi:file"
				/>

				<!-- @slot Text to be shown for the delete button -->
				<a
					:href="file.url || '#'"
					target="_blank"
				>
					<template v-if="file.name">{{ file.name }}</template>
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
@use '../field';

.file-uploader {
	display: flex;
	flex-direction: column;
	gap: var(--lnx-control-gap);
	width: 100%;

	--file-uploader-height: 64px;

	label {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--lnx-control-gap);
		width: 100%;

		&:has(input:disabled) {
			opacity: .5;
		}

		&:focus-within .box {
			border-color: var(--lnx-color-primary);
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
			padding: 0 var(--lnx-spacing-5);
			height: var(--file-uploader-height);
			border: var(--lnx-control-border);
			border-style: dashed;
			border-radius: var(--lnx-control-radius);
			transition: border-color .15s;

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
				border-color: var(--lnx-color-primary-light);

				.box-text span:not(.label) {
					font-weight: bold;
				}
			}
		}

		&.has-error .box {
			@include field.control-error;
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
}
</style>
