<script setup lang="ts" generic="T, U">
import { LnxInput } from '../input';
import { LnxIcon } from '../icon';
import { computed, Ref, ref, useAttrs, useTemplateRef, watch } from 'vue';
import { normalizeString } from '../helpers';
import { onClickOutside } from './onClickOutside';
import { useListOptionsFocus } from './useListOptionsFocus';
import { LnxDropdown } from '../dropdown';

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
		areOptionsAsync?: boolean; /* Indicates if the options are loaded asynchronously */
		labelProperty?: string; /* The property of the option to be shown as a label */
		searchPlaceholderText?: string; /* The placeholder text of the search input */
		convertFn?: (value: T) => T | U; /* Function to convert the v-model value to something */
		isLoading?: boolean; /* When loading, it is disabled and shows different content */
		hasError?: boolean; /* Indicates if it should show the error slot */
		loadingOptions?: boolean; /* Indicates if the options are being loaded asynchronously at the moment */
		customValidity?: string; /* The error message of the input. It is the default value for the `error` slot */
	}>(), {
		options: () => [],
		convertFn: undefined,
		customValidity: undefined,
		labelProperty: '',
		searchPlaceholderText: 'Search...',
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
	optionInput(props: { value: U }): unknown; /* How the option will be shown in the input when selected */
	loadingOptions(): unknown; /* What will be shown when async options are being loaded */
	notFound(): unknown; /* What will be shown when there are no options to show */
}>();
const inputSlotNames = Object.keys(slots).filter(slot => ['default', 'helper', 'error'].includes(slot)) as ('default' | 'helper' | 'error')[];

const $attrs = useAttrs();
const isReadonly = computed(() => props.isLoading || !!('readonly' in $attrs && ($attrs.readonly || $attrs.readonly === '')));
const isDisabled = computed(() => props.isLoading || !!('disabled' in $attrs && ($attrs.disabled || $attrs.disabled === '')));

const showOptions = ref(false);
const $dropdown = useTemplateRef<typeof LnxDropdown>('$dropdown');

const searchQuery = ref<string>('');
watch(searchQuery, (newValue) => {
	$dropdown.value!.calculatePosition();
	emit('query', newValue);
});
const filteredOptions = computed<T[]>(() => {
	if (!searchQuery.value) {
		return props.options;
	}

	if (props.areOptionsAsync) {
		return props.options;
	}

	return props.options.filter((option) => {
		if(typeof option === 'object' && option !== null) {
			const optionValues = Object.values(option);
			return optionValues.some(value => normalizeString(String(value)).includes(normalizeString(searchQuery.value)));
		}
		return normalizeString(String(option)).includes(normalizeString(searchQuery.value));
	});
});
watch(filteredOptions, () => $dropdown.value!.calculatePosition(), { deep: true });

const inputValue = computed<string>(() => {
	if (searchQuery.value) {
		return searchQuery.value;
	}

	if (!modelValue.value) {
		return '';
	}

	if (!showOptions.value) {
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
	if (showOptions.value) {
		return '';
	}

	if (typeof modelValue.value !== 'string') {
		console.warn('⚠️ [LnxSelect]: When using a non-string v-model value, a labelProperty or convertFn must be provided to show the selected value properly.');
	}

	return String(modelValue.value || '');
});

const $input = useTemplateRef<HTMLInputElement>('$input');
function cleanInputContent() {
	if (document.activeElement !== $input.value) {
		return;
	}

	searchQuery.value = '';
}

const $list = useTemplateRef<HTMLUListElement>('$list');

function hideOptionsList() {
	showOptions.value = false;
	focusedOptionIndex.value = null;
	searchQuery.value = '';
}
onClickOutside($list as Ref<HTMLUListElement>, () => hideOptionsList());

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
	await $dropdown.value!.calculatePosition();
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
	hideOptionsList();
}

function isSelected(option: T) {
	if (!!props.convertFn) {
		return JSON.stringify(props.convertFn(option)) === JSON.stringify(modelValue.value);
	}

	return JSON.stringify(option) === JSON.stringify(modelValue.value);
}

const dropdownOffsetY = computed(() => {
	let total = 6;
	if (!!slots.helper) {
		total -= 16;
	}
	if (!!slots.error) {
		total -= 16;
	}
	return total;
});
</script>

<template>
	<LnxDropdown
		ref="$dropdown"
		:is-open="showOptions"
		:offset-y="dropdownOffsetY"
	>
		<div
			class="select"
			:class="{ 'has-error': hasError }"
			@click="showOptionsList()"
			@keydown.enter="!showOptions && showOptionsList()"
		>
			<LnxInput
				v-bind="{ ...$attrs, ...props }"
				ref="$input"
				v-model="searchQuery"
				:placeholder="showOptions ? searchPlaceholderText : $attrs.placeholder"
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

				<template #icon>
					<LnxIcon icon="mdi:chevron-down" />
				</template>
			</LnxInput>

			<div
				v-if="!!modelValue && !labelProperty && !!$slots.optionInput && !showOptions"
				class="input-content"
			>
				<slot
					name="optionInput"
					:value="modelValue as U"
				>
					{{ modelValue }}
				</slot>
			</div>
		</div>

		<template #content>
			<ul
				class="list"
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
					v-else
					class="list-option empty"
				>
					<slot name="notFound">
						<small class="list-option-label">Not found</small>
					</slot>
				</li>
			</ul>
		</template>
	</LnxDropdown>
</template>

<style scoped lang="scss">
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
		top: 24px;
		padding: 0 28px 0 8px;
		overflow: hidden;
		max-width: calc(100% - 36px);
		text-overflow: ellipsis;
		white-space: nowrap;
		pointer-events: none;
	}
}

.list {
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
</style>