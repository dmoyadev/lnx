<script setup lang="ts">
import { nextTick, ref, useId, useTemplateRef, watch } from 'vue';
import { BUTTON_MODES, BUTTON_SHAPES, BUTTON_VARIANTS, LnxButton } from '../button';
import { LnxIcon } from '../icon';
import { useLnxConfig } from '../config';

const config = useLnxConfig();

const props = withDefaults(defineProps<{
	title?: string; /* Title of the modal */
	hideCloseButton?: boolean; /* Hide the close button in the top right corner */
	allowCloseOnOverlayClick?: boolean; /* Allow closing the modal when clicking on the overlay */
}>(), { title: '' });

const emit = defineEmits<{
	open: [] /* When the modal dialog is opened */
	close: [] /* When the modal dialog is closed */
}>();

defineSlots<{
	default(props: { open: () => void, close: () => void }): unknown; /* Opener element */
	icon(): unknown /* Shown next to the title of the modal */
	content(props: { close: () => void }): unknown; /* The main content of the modal */
	actions(props: { close: () => void }): unknown; /* Some actions to show at the end of the dialog */
}>();

const isOpen = ref(false);
defineExpose({ isOpen });

const titleId = useId();
const $dialog = useTemplateRef<HTMLDialogElement>('$dialog');
// showModal() puts the dialog in the top layer: background is inert, focus stays inside and Esc fires `cancel`
let $opener: HTMLElement | null = null;
watch(isOpen, async (value) => {
	if(!value) { return; }
	$opener = document.activeElement as HTMLElement | null;
	await nextTick();
	$dialog.value?.showModal();
});

function onCancel(event: Event) {
	event.preventDefault(); // Let the component remove the dialog so the state and the `close` event stay in sync
	if(!props.hideCloseButton) {
		closeModal();
	}
}

function onDialogClick(event: MouseEvent) {
	// Clicks on the backdrop target the dialog itself, outside its box
	const rect = $dialog.value!.getBoundingClientRect();
	const isOnBackdrop = event.target === $dialog.value && (
		event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom
	);
	if(isOnBackdrop && props.allowCloseOnOverlayClick) {
		closeModal();
	}
}
function openModal() {
	isOpen.value = true;
	emit('open');
}
function closeModal() {
	isOpen.value = false;
	emit('close');
}
</script>

<template>
	<slot
		:open="openModal"
		:close="closeModal"
	/>

	<Teleport to="body">
		<!-- The dialog is removed instead of closed, so focus is given back by hand once the page is no longer inert -->
		<Transition @after-leave="$opener?.focus()">
			<dialog
				v-if="isOpen"
				ref="$dialog"
				v-bind="$attrs"
				class="modal"
				:class="{ 'is-backdrop-clickable': allowCloseOnOverlayClick }"
				:aria-labelledby="title || $slots.icon ? titleId : undefined"
				@cancel="onCancel"
				@click="onDialogClick"
			>
				<header v-if="title || $slots.icon || !hideCloseButton">
					<h2
						v-if="title || $slots.icon"
						:id="titleId"
					>
						<slot name="icon" />
						{{ title }}
					</h2>

					<LnxButton
						v-if="!hideCloseButton"
						class="btn-close"
						:aria-label="config.texts.close"
						:variant="BUTTON_VARIANTS.GRAYSCALE"
						:mode="BUTTON_MODES.CLEAR"
						:shape="BUTTON_SHAPES.ICON"
						@click="closeModal()"
					>
						<LnxIcon icon="mdi:times" />
					</LnxButton>
				</header>

				<slot
					name="content"
					:close="closeModal"
				/>

				<footer v-if="$slots.actions">
					<slot
						name="actions"
						:close="closeModal"
					/>
				</footer>
			</dialog>
		</Transition>
	</Teleport>
</template>

<style scoped lang="scss">
.modal {
	background: var(--lnx-color-surface);
	color: var(--lnx-color-text);
	min-width: 200px;
	max-width: 95dvw;
	min-height: 200px;
	max-height: 95dvh;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: var(--lnx-spacing-2);
	padding: 0 var(--lnx-spacing-4);
	border-radius: var(--lnx-surface-radius);
	border: 1px solid var(--lnx-color-border);

	&::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}

	&.is-backdrop-clickable::backdrop {
		cursor: pointer;
	}

	header {
		position: sticky;
		top: 0;
		background: var(--lnx-color-surface);
		padding: var(--lnx-spacing-4) 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--lnx-spacing-2);

		h2 {
			display: flex;
			align-items: center;
			gap:var(--lnx-spacing-2);
		}

		.btn-close {
			margin-left: auto;
			margin-right: calc(-1 * var(--lnx-spacing-2));
			color: var(--lnx-color-text);
		}
	}

	footer {
		position: sticky;
		bottom: 0;
		background: var(--lnx-color-surface);
		border-top: 1px solid var(--lnx-color-divider);
		padding: var(--lnx-spacing-4) 0;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: var(--lnx-spacing-2);
		margin-top: auto;
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