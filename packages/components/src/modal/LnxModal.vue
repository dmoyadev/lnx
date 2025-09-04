<script setup lang="ts">
import { ref } from 'vue';
import { ButtonModes, ButtonShapes, ButtonVariants, LnxButton } from '../button';
import { LnxIcon } from '../icon';

withDefaults(defineProps<{
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
		<Transition>
			<div
				v-if="isOpen"
				class="modal"
			>
				<div
					class="overlay"
					:style="{ cursor: allowCloseOnOverlayClick ? 'pointer' : 'default' }"
					@click="allowCloseOnOverlayClick && closeModal()"
				/>

				<dialog
					v-bind="$attrs"
					:open="isOpen"
				>
					<header v-if="title || $slots.icon || !hideCloseButton">
						<h2 v-if="title || $slots.icon">
							<slot name="icon" />
							{{ title }}
						</h2>

						<LnxButton
							v-if="!hideCloseButton"
							class="btn-close"
							:variant="ButtonVariants.GRAYSCALE"
							:mode="ButtonModes.CLEAR"
							:shape="ButtonShapes.ICON"
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
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped lang="scss">
.modal {
	position: fixed;
	inset: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000000;

	.overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
	}

	dialog {
		z-index: 1;
		background: var(--lnx-color-bg);
		min-width: 200px;
		max-width: 95dvw;
		min-height: 200px;
		max-height: 95dvh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: var(--lnx-spacing-2);
		padding: 0 var(--lnx-spacing-4);
		border-radius: var(--lnx-radius-3);
		border: 1px solid var(--lnx-color-gray-5);

		header {
			position: sticky;
			top: 0;
			background: var(--lnx-color-bg);
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
				margin-right: calc(0 - var(--lnx-spacing-2));
				color: var(--lnx-color-text);
			}
		}

		footer {
			position: sticky;
			bottom: 0;
			background: var(--lnx-color-bg);
			border-top: 1px solid var(--lnx-color-gray-2);
			padding: var(--lnx-spacing-4) 0;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			gap: var(--lnx-spacing-2);
			margin-top: auto;
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