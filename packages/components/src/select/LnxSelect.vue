<script setup lang="ts" generic="T extends { id: number | string }">
import { LnxInput } from '../input';
import { LnxIcon } from '../icon';
import { computed, nextTick, onMounted, onUnmounted, Ref, ref, useAttrs, useTemplateRef, watch } from 'vue';
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
	labelProperty: '',
});

const slots = defineSlots<{
	default(): unknown; /* The label of the input */
	helper(): unknown; /* The helper message of the input */
	error(): unknown; /* The error message of the input */
	item(props: { item: T }): unknown; /* How the item will be shown in the list */
	itemInput(props: { item: T }): unknown; /* How the item will be shown in the input when selected */
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

	if (!showItems.value && modelValue.value && props.convertFn) {
		if (props.labelProperty) {
			return String(modelValue.value[props.labelProperty as keyof T]);
		}

		if (typeof modelValue.value === 'string') {
			return modelValue.value as string;
		}
		return String(modelValue.value);
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
onClickOutside($list as Ref<HTMLUListElement>, () => hideItemsList());

const showItems = ref(false);
async function showItemsList() {
	if (isDisabled.value || isReadonly.value) {
		return;
	}
	focusedItemIndex.value = null;
	showItems.value = true;

	if (!$list.value || !$input.value || isDisabled.value || isReadonly.value) {
		return;
	}
	await calculateListPosition();
}
function hideItemsList() {
	showItems.value = false;
	focusedItemIndex.value = null;
	itemsQuery.value = '';
}

async function calculateListPosition() {
	await nextTick();
	if (!showItems.value || !$list.value || !$input.value) {
		return;
	}

	// @ts-expect-error Vue internals
	const inputPosition = $input.value.$el.getBoundingClientRect();
	const scrollAmount = document.documentElement.scrollTop || document.body.scrollTop;

	$list.value.style.width = `${inputPosition.width}px`;
	$list.value.style.transform = `translate(${inputPosition.x}px, ${inputPosition.y + scrollAmount + 56 + 4}px)`;

	const isListOutOfViewport: OutOfView = isOutOfViewport($list.value);
	if(isListOutOfViewport.bottom) {
		$list.value.style.transform = `translate(${inputPosition.x}px, ${inputPosition.y + scrollAmount - $list.value.offsetHeight - 4}px)`;
	}
}

onMounted(() => {
	addEventListener('resize', calculateListPosition);
	addEventListener('scroll', calculateListPosition);
});
onUnmounted(() => {
	removeEventListener('resize', calculateListPosition);
	removeEventListener('scroll', calculateListPosition);
});
watch(showItems, () => calculateListPosition);

const focusedItemIndex = ref<number | null>(null);
function focusItem(direction: 1 | -1) {
	if (!showItems.value) {
		return;
	}

	if (focusedItemIndex.value == null) {
		focusedItemIndex.value = 0;
		return;
	}

	if (direction === -1 && focusedItemIndex.value === 0) {
		focusedItemIndex.value = filteredItems.value.length - 1;
		return;
	}

	if (direction === 1 && focusedItemIndex.value === filteredItems.value.length - 1) {
		focusedItemIndex.value = 0;
		return;
	}
	focusedItemIndex.value += direction;
}
watch(focusedItemIndex, (_, newValue) => {
	const listItems = $list.value?.querySelectorAll('.list-item');
	if (!listItems?.length || newValue == null) {
		return;
	}

	(listItems[newValue] as HTMLElement).focus();
});

function select(item: T) {
	modelValue.value = item;
	hideItemsList();
}
</script>

<template>
	<div
		class="select"
		:class="{ 'has-error': hasError }"
		@click="showItemsList()"
		@keydown.esc="hideItemsList()"
	>
		<LnxInput
			v-bind="{ ...$attrs, ...props }"
			ref="$input"
			v-model="itemsQuery"
			:value="inputValue"
			type="text"
			@click="cleanItemsQuery()"
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

			<template #icon>
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
					v-show="showItems"
					ref="$list"
					class="list"
					tabindex="0"
					@keydown.up.prevent="focusItem(-1)"
					@keydown.down.prevent="focusItem(1)"
				>
					<!-- Normal state -->
					<template v-if="filteredItems?.length">
						<li
							v-for="(item, index) in filteredItems"
							:key="index"
							class="list-item"
							:class="{
								'selected': (!!convertFn
									? JSON.stringify(convertFn(item))
									: JSON.stringify(item)
								) === JSON.stringify(modelValue),
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
		</Teleport>
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
		top: 20px;
		padding: 6px 28px 4px 8px;
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