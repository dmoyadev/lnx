<script setup lang="ts" generic="T, U">
import { LnxInput } from '../input';
import { LnxIcon } from '../icon';
import { computed, Ref, ref, useAttrs, useTemplateRef, watch } from 'vue';
import { normalizeString } from '../helpers';
import { onClickOutside } from './onClickOutside';
import { useListPosition } from './useListPosition';
import { useListOptionsFocus } from './useListOptionsFocus';

const [modelValue, modifiers] = defineModel<U, 'convert'>({
	set(value: U) {
		if(!!modifiers.convert && !!props.convertFn && typeof value !== 'string') {
			return props.convertFn(value as unknown as T);
		}

		return value as U;
	},
});

const props = withDefaults(
	defineProps<{
		options?: T[]; /* The options to be shown in the select */
		areOptionsAsync?: boolean; /* Indicates if the options are being loaded asynchronously */
		labelProperty?: string; /* The property of the option to be shown as a label */
		convertFn?: (value: T) => unknown; /* Function to convert the v-model value to something */
		allowFreeText?: boolean; /* Allow free text input that is not in the options list */
		isLoading?: boolean; /* When loading, it is disabled and shows different content */
		hasError?: boolean; /* Indicates if it should show the error slot */
		loadingOptions?: boolean; /* Indicates if the options are being loaded asynchronously */
		customValidity?: string; /* The error message of the input. It is the default value for the `error` slot */
	}>(), {
		options: () => [],
		convertFn: undefined,
		customValidity: undefined,
		labelProperty: '',
	},
);

const emit = defineEmits<{
	query: [query: string] /* When the input search is written */
	select: [option: T] /* When an option is selected */
}>();

const slots = defineSlots<{
	default(): unknown; /* The label of the input */
	helper(): unknown; /* The helper message of the input */
	error(): unknown; /* The error message of the input */
	option(props: { option: T }): unknown; /* How the option will be shown in the list */
	optionInput(props: { option: U }): unknown; /* How the option will be shown in the input when selected */
	loadingOptions(): unknown; /* What will be shown when async options are being loaded */
	notFound(): unknown; /* What will be shown when there are no options to show */
}>();
const inputSlotNames = Object.keys(slots).filter(slot => ['default', 'helper', 'error'].includes(slot)) as ('default' | 'helper' | 'error')[];

const $attrs = useAttrs();
const isReadonly = computed(() => props.isLoading || !!('readonly' in $attrs && ($attrs.readonly || $attrs.readonly === '')));
const isDisabled = computed(() => props.isLoading || !!('disabled' in $attrs && ($attrs.disabled || $attrs.disabled === '')));

const inputContent = ref<string>('');
watch(inputContent, (newValue) => {
	calculateListPosition();
	emit('query', newValue);
	if(props.allowFreeText) {
		modelValue.value = newValue as U;
		return;
	}
});
const filteredOptions = computed<T[]>(() => {
	if (props.allowFreeText) {
		return props.options;
	}

	if (!inputContent.value) {
		return props.options;
	}

	if (props.areOptionsAsync) {
		return props.options;
	}

	return props.options.filter((option) => {
		if(typeof option === 'object' && option !== null) {
			const optionValues = Object.values(option);
			return optionValues.some(value => normalizeString(String(value)).includes(normalizeString(inputContent.value)));
		}
		return normalizeString(String(option)).includes(normalizeString(inputContent.value));
	});
});
watch(filteredOptions, () => calculateListPosition(), { deep: true });

const inputValue = computed<string>(() => {
	// When there is a query or free text is allowed, show the query
	if (inputContent.value || props.allowFreeText) {
		return inputContent.value;
	}

	if(!modelValue.value) {
		return '';
	}

	if(!showOptions.value) {
		// When a custom option input slot is provided, show nothing in the input to allow the slot to be shown
		if(!!slots.optionInput) {
			return '';
		}

		// When there is a selected option and a label property
		if (
			typeof modelValue.value === 'object'
			&& typeof props.labelProperty === 'string'
			&& props.labelProperty in modelValue.value
		) {
			return String((modelValue.value as Record<string, unknown>)[props.labelProperty]);
		}
	}

	// When there is a selected option and options are shown, clear the input to allow filtering
	if(showOptions.value) {
		return '';
	}

	if(typeof modelValue.value !== 'string') {
		console.warn('⚠️ [LnxSelect]: When using a non-string v-model value, a labelProperty or convertFn must be provided to show the selected value properly.');
	}

	return String(modelValue.value || '');
});

const $input = useTemplateRef<HTMLInputElement>('$input');
function cleanInputContent() {
	if (props.allowFreeText) {
		return;
	}

	if (document.activeElement !== $input.value) {
		return;
	}

	inputContent.value = '';
}

const $list = useTemplateRef<HTMLUListElement>('$list');

function hideOptionsList(clearInput = false) {
	showOptions.value = false;
	focusedOptionIndex.value = null;
	if(clearInput && !props.allowFreeText) {
		inputContent.value = '';
	}
}
onClickOutside($list as Ref<HTMLUListElement>, () => hideOptionsList());

const { calculateListPosition } = useListPosition($list as Ref<HTMLElement>, $input as Ref<HTMLElement>);
const showOptions = ref(false);
watch(showOptions, () => calculateListPosition);

async function showOptionsList() {
	if (isDisabled.value || isReadonly.value) {
		return;
	}

	cleanInputContent();

	focusedOptionIndex.value = null;
	showOptions.value = true;

	if (!$list.value || !$input.value || isDisabled.value || isReadonly.value) {
		return;
	}
	await calculateListPosition();
}

const { focusedOptionIndex, focusOption } = useListOptionsFocus(filteredOptions.value.length);
watch(focusedOptionIndex, (_, newValue) => {
	const listOptions = $list.value?.querySelectorAll('.list-option');
	if (!listOptions?.length || newValue == null) {
		return;
	}

	(listOptions[newValue] as HTMLElement).focus();
});

function select(option: T) {
	modelValue.value = option as unknown as U;
	emit('select', option);
	if(!!props.convertFn) {
		inputContent.value = String(props.convertFn(option));
	} else {
		inputContent.value = String(option);
	}
	hideOptionsList(true);
}

function isSelected(option: T) {
	if (!!props.convertFn) {
		return JSON.stringify(props.convertFn(option)) === JSON.stringify(modelValue.value);
	}

	return JSON.stringify(option) === JSON.stringify(modelValue.value);
}
</script>

<template>
	<div
		class="select"
		:class="{ 'has-error': hasError }"
		@click="showOptionsList()"
		@keydown.enter="!showOptions && showOptionsList()"
	>
		<LnxInput
			v-bind="{ ...$attrs, ...props }"
			ref="$input"
			v-model="inputContent"
			:value="inputValue"
			type="text"
			@keydown.up.prevent="focusOption(-1)"
			@keydown.down.prevent="focusOption(1)"
		>
			<!-- Pass all slots to the input -->
			<template
				v-for="name in inputSlotNames"
				#[name]
			>
				<slot :name />
			</template>

			<template
				v-if="!props.allowFreeText || filteredOptions?.length"
				#icon
			>
				<LnxIcon icon="mdi:chevron-down" />
			</template>
		</LnxInput>

		<div
			v-if="!!modelValue && !labelProperty && !!$slots.optionInput && !showOptions"
			class="input-content"
		>
			<slot
				name="optionInput"
				:option="modelValue as U"
			>
				{{ modelValue }}
			</slot>
		</div>

		<!-- Option list -->
		<Teleport to="body">
			<Transition>
				<ul
					v-show="showOptions && (filteredOptions.length || !props.allowFreeText)"
					ref="$list"
					class="list"
					tabindex="0"
					@keydown.up.prevent="focusOption(-1)"
					@keydown.down.prevent="focusOption(1)"
					@keydown.esc="hideOptionsList()"
				>
					<!-- Normal state -->
					<template v-if="filteredOptions?.length">
						<li
							v-for="(option, index) in filteredOptions"
							:key="index"
							class="list-option"
							:class="{
								'selected': isSelected(option),
							}"
							tabindex="0"
							@click.stop="select(option)"
							@keydown.enter="select(option)"
						>
							<span class="list-option-label">
								<slot
									name="option"
									:option
								>
									<span>
										{{
											(typeof option === 'object' && option !== null && labelProperty && labelProperty in option)
												? option[labelProperty as keyof typeof option]
												: option
										}}
									</span>
								</slot>
							</span>

							<span
								v-if="JSON.stringify(option) === JSON.stringify(modelValue)"
								class="selected-option-icon"
							>
								<LnxIcon
									:size="12"
									icon="mdi:check"
								/>
							</span>
						</li>
					</template>

					<!-- Loading state -->
					<li
						v-else-if="loadingOptions"
						class="list-option empty"
					>
						<slot name="loadingOptions">
							<LnxIcon
								icon="line-md:loading-twotone-loop"
								:size="16"
							/>
						</slot>
					</li>

					<!-- Empty state -->
					<li
						v-else-if="!allowFreeText"
						class="list-option empty"
					>
						<slot name="notFound">
							<small class="list-option-label">Not found</small>
						</slot>
					</li>
				</ul>
			</Transition>
		</Teleport>
	</div>
</template>

<style scoped lang="scss">
:global(.select-dropdown .v-popper__arrow-container) {
	display: none;
}
:global(.select-dropdown .v-popper__wrapper) {
	width: 100%;
}

.select {
	position: relative;

	&:has(.input-content) {
		.input {
			::placeholder {
				color: transparent;
			}
		}
	}

	.input-content {
		position: absolute;
		inset: 0;
		top: 23px;
		padding: 0 28px 0 8px;
		overflow: hidden;
		max-width: calc(100% - 36px);
		text-overflow: ellipsis;
		white-space: nowrap;
		pointer-events: none;
	}
}

.list {
	will-change: opacity;
	--input-height: 52px;
	background: var(--lnx-select-list-color-bg, var(--lnx-color-gray-9));
	position: absolute;
	top: 0;
	left: 0;
	z-index: 100001;
	border: 1px solid var(--lnx-color-gray-3);
	border-radius: var(--lnx-radius-3);
	box-shadow: var(--lnx-elevation-3);
	max-height: 296px;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 4px;
	margin: 0;

	.list-option {
		display: flex;
		align-options: center;
		justify-content: space-between;
		gap: 4px;
		padding: 8px;
		margin: 0 6px;

		&:first-child {
			margin-top: 6px;
		}

		&:last-child {
			margin-bottom: 6px;
		}

		&:hover:not(&.empty),
		&:focus:not(&.empty),
		&.selected:not(&.empty) {
			cursor: pointer;
			background: var(--lnx-color-gray-bg);
			border-radius: var(--lnx-radius-2);
		}

		&.empty {
			text-align: center;
			justify-content: center;
			font-style: italic;
		}
	}
}

.v-enter-active,
.v-leave-active {
	transition: opacity .2s;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>