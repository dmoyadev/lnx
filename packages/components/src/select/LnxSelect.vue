<script setup lang="ts" generic="T extends { id: number | string }">
import { LnxInput } from '../input';
import { LnxIcon } from '../icon';
import { computed, onMounted, onUnmounted, Ref, ref, useAttrs, useTemplateRef, watch } from 'vue';
import { isOutOfViewport, normalizeString, OutOfView } from '../helpers';
import { onClickOutside } from './onClickOutside';

const [modelValue, modifiers] = defineModel<T, 'convert'>({
	set(value: T) {
		if(modifiers.convert && props.convertFn) {
			return props.convertFn(value);
		}

		return value;
	},
});

const props = withDefaults(defineProps<{
	items: T[]; /* The items to be shown in the select */
	labelProperty?: string; /* The property of the item to be shown as a label */
	convertFn?: (value: T) => unknown; /* Function to convert the v-model value to something */
	isLoading?: boolean; /* When loading, it is disabled and shows different content */
	hasError?: boolean; /* Indicates if it should show the error slot */
	customValidity?: string; /* The error message of the input. It is the default value for the `error` slot */
}>(), {
	convertFn: undefined,
	customValidity: undefined,
	labelProperty: 'label',
});

const slots = defineSlots<{
	default(): unknown; /* The label of the input */
	helper(): unknown; /* The helper message of the input */
	error(): unknown; /* The error message of the input */
	item(props: { item: T }): unknown; /* How the item will be shown in the list */
	notFound(): unknown; /* What will be shown when there are no items to show */
}>();
const inputSlotNames = Object.keys(slots).filter(slot => ['default', 'helper', 'error'].includes(slot)) as ('default' | 'helper' | 'error')[];

const $attrs = useAttrs();
const isReadonly = computed(() => props.isLoading || !!('readonly' in $attrs && ($attrs.readonly || $attrs.readonly === '')));
const isDisabled = computed(() => props.isLoading || !!('disabled' in $attrs && ($attrs.disabled || $attrs.disabled === '')));

const itemsQuery = ref<string>('');
const filteredItems = computed(() => {
	if (!itemsQuery.value) {
		return props.items;
	}

	return props.items.filter((item) => {
		const itemValues = Object.values(item);
		return itemValues.some(value => normalizeString(String(value))
			.includes(normalizeString(itemsQuery.value)),
		);
	});
});

const inputValue = computed<string>(() => {
	if (itemsQuery.value) {
		return itemsQuery.value;
	}
	if (!showItems.value && modelValue.value?.[props.labelProperty as keyof T]) {
		return String(modelValue.value[props.labelProperty as keyof T]);
	}
	return '';
});

const $input = useTemplateRef<HTMLInputElement>('$input');
function cleanItemsQuery() {
	if (document.activeElement !== $input.value) {
		return;
	}

	itemsQuery.value = '';
}

const $list = useTemplateRef<HTMLUListElement>('$list');
onClickOutside($list as Ref<HTMLUListElement>, () => {
	itemsQuery.value = '';
	showItems.value = false;
});

const showItems = ref(false);
function showItemsList() {
	if (isDisabled.value || isReadonly.value) {
		return;
	}
	focusedItemIndex.value = null;
	showItems.value = true;
	$list.value?.focus();
}

const isListOutOfViewport = ref<OutOfView>();
function checkListPosition() {
	if ($list.value) {
		isListOutOfViewport.value = isOutOfViewport($list.value);
	}
}
onMounted(() => addEventListener('resize', checkListPosition));
onUnmounted(() => removeEventListener('resize', checkListPosition));
watch(showItems, () => checkListPosition);

const focusedItemIndex = ref();
function focusItem(direction: 1 | -1) {
	if (!showItems.value) {
		return;
	}

	if (focusedItemIndex.value == null) {
		focusedItemIndex.value = 0;
	} else {
		focusedItemIndex.value += direction;
	}
}
watch(focusedItemIndex, (value) => {
	const listItems = $list.value?.querySelectorAll('.list-item');
	if (!listItems?.length || value == null) {
		return;
	}

	(listItems[value] as HTMLElement).focus();
});

function select(item: T) {
	modelValue.value = item;
	itemsQuery.value = '';
	showItems.value = false;
}
</script>

<template>
	<div
		class="select"
		:class="{ 'has-error': hasError }"
		@click="showItems = true;"
		@focus="showItemsList()"
		@keydown.esc="showItems = false"
		@keydown.up.prevent="focusItem(-1)"
		@keydown.down.prevent="focusItem(1)"
	>
		<LnxInput
			v-bind="{ ...$attrs, ...props }"
			ref="$input"
			v-model="itemsQuery"
			:value="inputValue"
			type="text"
			@click="cleanItemsQuery()"
			@focus="showItemsList()"
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

		<!-- Option list -->
		<Transition>
			<ul
				v-show="showItems"
				ref="$list"
				class="list"
				:class="isListOutOfViewport"
			>
				<!-- Normal state -->
				<template v-if="filteredItems?.length">
					<li
						v-for="(item, index) in filteredItems"
						:key="index"
						class="list-item"
						:class="{
							'selected': JSON.stringify(item) === JSON.stringify(modelValue),
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
								<span>{{ (labelProperty && labelProperty in item) ? item[labelProperty as keyof typeof item] : item }}</span>
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

				<!-- Empty state -->
				<li
					v-else
					class="list-item empty"
				>
					<slot name="notFound">
						<span class="list-item-label">Not found</span>
					</slot>
				</li>
			</ul>
		</Transition>
	</div>
</template>

<!--suppress CssInvalidFunction -->
<style scoped lang="scss">
:global(.select-dropdown .v-popper__arrow-container) {
	display: none;
}
:global(.select-dropdown .v-popper__wrapper) {
	width: 100%;
}

.select {
	position: relative;

	.list {
		--input-height: 52px;
		z-index: 100001;
		top: var(--input-height);
		background: var(--lnx-select-list-color-bg, var(--lnx-color-gray-9));
		border: 1px solid var(--lnx-color-gray-5);
		border-radius: var(--lnx-radius-2);
		padding: var(--lnx-spacing-2);
		position: absolute;
		width: 100%;
		max-height: 296px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin: 0;


		// When out of viewport
		&.left { left: 0; }
		&.right { left: -100%; }
		&.bottom { transform: translateY(calc(-100% - var(--input-height))); }

		.list-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 4px;
			padding: 8px;

			&:hover:not(&.empty),
			&:focus:not(&.empty),
			&.selected:not(&.empty) {
				cursor: pointer;
				background: var(--lnx-color-gray-bg);
				border-radius: var(--lnx-radius-2);
			}
		}
	}
}

.v-enter-active,
.v-leave-active {
	transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>