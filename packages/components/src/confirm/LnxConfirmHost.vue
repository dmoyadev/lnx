<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, useId, useTemplateRef, watch } from 'vue';
import { BUTTON_MODES, BUTTON_VARIANTS, LnxButton } from '../button';
import { useLnxConfig } from '../config';
import { confirmQueue, mountedConfirmHosts } from './state';

const config = useLnxConfig();
const titleId = useId();
const messageId = useId();

onMounted(() => mountedConfirmHosts.value++);
onBeforeUnmount(() => mountedConfirmHosts.value--);

const current = computed(() => confirmQueue[0]);
const variant = computed(() => current.value?.variant ?? BUTTON_VARIANTS.PRIMARY);

// showModal() puts the dialog in the top layer: the page is inert, focus stays inside and goes to the autofocus button
const $dialog = useTemplateRef<HTMLDialogElement>('$dialog');
let $opener: HTMLElement | null = null;
watch(current, async (request, previous) => {
	if(!request) { return; }
	if(!previous) {
		$opener = document.activeElement as HTMLElement | null;
	}
	await nextTick();
	if(!$dialog.value?.open) {
		$dialog.value?.showModal();
	}
}, { immediate: true });

function answer(confirmed: boolean) {
	const request = confirmQueue.shift();
	request?.resolve(confirmed);
}

function onCancel(event: Event) {
	event.preventDefault(); // Let the host remove the dialog, so the queue stays in sync
	answer(false);
}

function onDialogClick(event: MouseEvent) {
	// Clicks on the backdrop target the dialog itself, outside its box
	const rect = $dialog.value!.getBoundingClientRect();
	const isOnBackdrop = event.target === $dialog.value && (
		event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom
	);
	if(isOnBackdrop) {
		answer(false);
	}
}

// Answered dialogs leave one by one, and the page is inert until the last one is gone, so every one tries
function restoreFocus() {
	if(!confirmQueue.length) {
		$opener?.focus();
	}
}
</script>

<template>
	<Teleport to="body">
		<!-- The dialog is removed instead of closed, so focus is given back by hand once the page is no longer inert -->
		<Transition @after-leave="restoreFocus()">
			<dialog
				v-if="current"
				:key="current.id"
				ref="$dialog"
				class="lnx-confirm"
				:aria-labelledby="titleId"
				:aria-describedby="current.message ? messageId : undefined"
				@cancel="onCancel"
				@click="onDialogClick"
			>
				<h2 :id="titleId">
					{{ current.title }}
				</h2>
				<p
					v-if="current.message"
					:id="messageId"
				>
					{{ current.message }}
				</p>

				<footer>
					<LnxButton
						:variant="BUTTON_VARIANTS.GRAYSCALE"
						:mode="BUTTON_MODES.OUTLINE"
						:autofocus="variant === BUTTON_VARIANTS.DANGER"
						@click="answer(false)"
					>
						{{ current.cancelText ?? config.texts.cancel }}
					</LnxButton>
					<LnxButton
						:variant
						:autofocus="variant !== BUTTON_VARIANTS.DANGER"
						@click="answer(true)"
					>
						{{ current.confirmText ?? config.texts.confirm }}
					</LnxButton>
				</footer>
			</dialog>
		</Transition>
	</Teleport>
</template>

<style scoped lang="scss">
.lnx-confirm {
	width: min(420px, 100dvw - 2 * var(--lnx-spacing-4));
	padding: var(--lnx-spacing-4);
	display: flex;
	flex-direction: column;
	gap: var(--lnx-spacing-3);
	background: var(--lnx-color-surface);
	color: var(--lnx-color-text);
	border-radius: var(--lnx-surface-radius);
	border: 1px solid var(--lnx-color-border);
	transition: opacity .2s ease, scale .2s ease;

	@starting-style {
		opacity: 0;
		scale: .96;
	}

	&::backdrop {
		background: rgba(0, 0, 0, 0.5);
		transition: opacity .2s ease;
	}

	@starting-style {
		&::backdrop {
			opacity: 0;
		}
	}

	h2 {
		margin: 0;
		font-size: var(--lnx-font-size-big);
		line-height: var(--lnx-line-height-big);
		text-wrap: balance;
	}

	p {
		margin: 0;
		color: var(--lnx-color-text-muted);
		line-height: 1.4;
		text-wrap: pretty;
	}

	footer {
		display: flex;
		justify-content: flex-end;
		gap: var(--lnx-spacing-2);
		margin-top: var(--lnx-spacing-2);
	}

	/* On phones the buttons take the whole width, stacked with confirm at the bottom, near the thumb */
	@media (max-width: 480px) {
		footer {
			flex-direction: column;
			align-items: stretch;
		}
	}
}

.v-leave-active {
	transition: opacity .15s ease;
}

.v-leave-to {
	opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
	.lnx-confirm {
		transition-property: opacity;
	}
}
</style>
