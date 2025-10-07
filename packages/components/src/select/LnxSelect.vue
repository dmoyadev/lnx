<script setup lang="ts" generic="T">
import { LnxInput } from '../input';
import { LnxIcon } from '../icon';
import { computed, Ref, ref, useAttrs, useTemplateRef, watch } from 'vue';
import { normalizeString } from '../helpers';
import { onClickOutside } from './onClickOutside';
import { useListPosition } from './useListPosition';
import { useListItemFocus } from './useListItemsFocus';

const [modelValue, modifiers] = defineModel<unknown, 'convert'>({
	set(value) {
		if(!!modifiers.convert && !!props.convertFn && typeof value !== 'string') {
			return props.convertFn(value as T);
		}

		return value as T;
	},
});

const props = withDefaults(
	defineProps<{
		items?: T[]; /* The items to be shown in the select */
		areItemsAsync?: boolean; /* Indicates if the items are being loaded asynchronously */
		labelProperty?: string; /* The property of the item to be shown as a label */
		convertFn?: (value: T) => unknown; /* Function to convert the v-model value to something */
		allowFreeText?: boolean; /* Allow free text input that is not in the items list */
		isLoading?: boolean; /* When loading, it is disabled and shows different content */
		hasError?: boolean; /* Indicates if it should show the error slot */
		loadingItems?: boolean; /* Indicates if the items are being loaded asynchronously */
		customValidity?: string; /* The error message of the input. It is the default value for the `error` slot */
	}>(), {
		items: () => [],
		convertFn: undefined,
		customValidity: undefined,
		labelProperty: '',
	},
);

const emit = defineEmits<{
	query: [query: string] /* When the input search is written */
	select: [item: T] /* When an item is selected */
}>();

const slots = defineSlots<{
	default(): unknown; /* The label of the input */
	helper(): unknown; /* The helper message of the input */
	error(): unknown; /* The error message of the input */
	item(props: { item: T }): unknown; /* How the item will be shown in the list */
	itemInput(props: { item: T }): unknown; /* How the item will be shown in the input when selected */
	loadingItems(): unknown; /* What will be shown when async items are being loaded */
	notFound(): unknown; /* What will be shown when there are no items to show */
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
		modelValue.value = newValue as unknown as T;
		return;
	}
});
const filteredItems = computed<T[]>(() => {
	if (props.allowFreeText) {
		return props.items;
	}

	if (!inputContent.value) {
		return props.items;
	}

	if (props.areItemsAsync) {
		return props.items;
	}

	return props.items.filter((item) => {
		if(typeof item === 'object' && item !== null) {
			const itemValues = Object.values(item);
			return itemValues.some(value => normalizeString(String(value)).includes(normalizeString(inputContent.value)));
		}
		return normalizeString(String(item)).includes(normalizeString(inputContent.value));
	});
});
watch(filteredItems, () => calculateListPosition(), { deep: true });

const inputValue = computed<string>(() => {
	// When there is a query or free text is allowed, show the query
	if (inputContent.value || props.allowFreeText) {
		return inputContent.value;
	}

	if(!modelValue.value) {
		return '';
	}

	if(!showItems.value) {
		// When a custom item input slot is provided, show nothing in the input to allow the slot to be shown
		if(!!slots.itemInput) {
			return '';
		}

		// When there is a selected item and a label property
		if (
			typeof modelValue.value === 'object'
			&& typeof props.labelProperty === 'string'
			&& props.labelProperty in modelValue.value
		) {
			return String((modelValue.value as Record<string, unknown>)[props.labelProperty]);
		}
	}

	// When there is a selected item and items are shown, clear the input to allow filtering
	if(showItems.value) {
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

function hideItemsList(clearInput = false) {
	showItems.value = false;
	focusedItemIndex.value = null;
	if(clearInput && !props.allowFreeText) {
		inputContent.value = '';
	}
}
onClickOutside($list as Ref<HTMLUListElement>, () => hideItemsList());

const { calculateListPosition } = useListPosition($list as Ref<HTMLElement>, $input as Ref<HTMLElement>);
const showItems = ref(false);
watch(showItems, () => calculateListPosition);

async function showItemsList() {
	if (isDisabled.value || isReadonly.value) {
		return;
	}

	cleanInputContent();

	focusedItemIndex.value = null;
	showItems.value = true;

	if (!$list.value || !$input.value || isDisabled.value || isReadonly.value) {
		return;
	}
	await calculateListPosition();
}

const { focusedItemIndex, focusItem } = useListItemFocus(filteredItems.value.length);
watch(focusedItemIndex, (_, newValue) => {
	const listItems = $list.value?.querySelectorAll('.list-item');
	if (!listItems?.length || newValue == null) {
		return;
	}

	(listItems[newValue] as HTMLElement).focus();
});

function select(item: T) {
	modelValue.value = item;
	emit('select', item);
	if(!!props.convertFn) {
		inputContent.value = String(props.convertFn(item));
	} else {
		inputContent.value = String(item);
	}
	hideItemsList(true);
}

function isSelected(item: T) {
	if (!!props.convertFn) {
		return JSON.stringify(props.convertFn(item)) === JSON.stringify(modelValue.value);
	}

	return JSON.stringify(item) === JSON.stringify(modelValue.value);
}
</script>

<template>
	<div
		class="select"
		:class="{ 'has-error': hasError }"
		@click="showItemsList()"
		@keydown.enter="!showItems && showItemsList()"
	>
		<LnxInput
			v-bind="{ ...$attrs, ...props }"
			ref="$input"
			v-model="inputContent"
			:value="inputValue"
			type="text"
			@keydown.up.prevent="focusItem(-1)"
			@keydown.down.prevent="focusItem(1)"
		>
			<!-- Pass all slots to the input -->
			<template
				v-for="name in inputSlotNames"
				#[name]
			>
				<slot :name />
			</template>

			<template
				v-if="!props.allowFreeText || filteredItems?.length"
				#icon
			>
				<LnxIcon icon="mdi:chevron-down" />
			</template>
		</LnxInput>

		<div
			v-if="!!modelValue && !labelProperty && !!$slots.itemInput && !showItems"
			class="input-content"
		>
			<slot
				name="itemInput"
				:item="modelValue"
			>
				{{ modelValue }}
			</slot>
		</div>

		<!-- Option list -->
		<Teleport to="body">
			<Transition>
				<ul
					v-show="showItems && (filteredItems.length || !props.allowFreeText)"
					ref="$list"
					class="list"
					tabindex="0"
					@keydown.up.prevent="focusItem(-1)"
					@keydown.down.prevent="focusItem(1)"
					@keydown.esc="hideItemsList()"
				>
					<!-- Normal state -->
					<template v-if="filteredItems?.length">
						<li
							v-for="(item, index) in filteredItems"
							:key="index"
							class="list-item"
							:class="{
								'selected': isSelected(item),
							}"
							tabindex="0"
							@click.stop="select(item)"
							@keydown.enter="select(item)"
						>
							<span class="list-item-label">
								<slot
									name="item"
									:item="item"
								>
									<span>
										{{
											(typeof item === 'object' && item !== null && labelProperty && labelProperty in item)
												? item[labelProperty as keyof typeof item]
												: item
										}}
									</span>
								</slot>
							</span>

							<span
								v-if="JSON.stringify(item) === JSON.stringify(modelValue)"
								class="selected-item-icon"
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
						v-else-if="loadingItems"
						class="list-item empty"
					>
						<slot name="loadingItems">
							<LnxIcon
								icon="line-md:loading-twotone-loop"
								:size="16"
							/>
						</slot>
					</li>

					<!-- Empty state -->
					<li
						v-else-if="!allowFreeText"
						class="list-item empty"
					>
						<slot name="notFound">
							<small class="list-item-label">Not found</small>
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

	.list-item {
		display: flex;
		align-items: center;
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