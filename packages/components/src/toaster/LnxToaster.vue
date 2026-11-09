<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { BUTTON_VARIANTS, type ButtonVariant } from '../button/types';
import { useLnxConfig } from '../config';
import { LnxIcon } from '../icon';
import { isMac, isTyping, LnxKbd, useEventListener } from '../shortcuts';
import { dismiss, mountedToasters, toasts, undo } from './toast';

const config = useLnxConfig();

onMounted(() => mountedToasters.value++);
onBeforeUnmount(() => mountedToasters.value--);

const ICONS: Record<ButtonVariant, string> = {
	[BUTTON_VARIANTS.PRIMARY]: 'lucide:circle-check',
	[BUTTON_VARIANTS.GRAYSCALE]: 'lucide:circle-check',
	[BUTTON_VARIANTS.SUCCESS]: 'lucide:circle-check',
	[BUTTON_VARIANTS.INFO]: 'lucide:info',
	[BUTTON_VARIANTS.WARNING]: 'lucide:triangle-alert',
	[BUTTON_VARIANTS.DANGER]: 'lucide:circle-alert',
};

// ⌘Z undoes the newest that can be undone. In a text field, it's the field's own undo
useEventListener(window, 'keydown', (event) => {
	const isMod = isMac ? event.metaKey : event.ctrlKey;
	if(isMod && !event.shiftKey && !event.altKey && event.key.toLowerCase() === 'z' && !event.defaultPrevented
		&& !isTyping(event.target) && toasts.some(item => item.undo)) {
		event.preventDefault();
		void undo();
	}
});
</script>

<template>
	<Teleport to="body">
		<!-- Read out as they come, and danger ones right away -->
		<TransitionGroup
			tag="ol"
			class="lnx-toaster"
			aria-live="polite"
		>
			<li
				v-for="item in toasts"
				:key="item.id"
				class="lnx-toast"
				:class="`toast-variant-${item.variant}`"
				:role="item.variant === BUTTON_VARIANTS.DANGER ? 'alert' : 'status'"
			>
				<LnxIcon
					:icon="ICONS[item.variant]"
					:size="18"
				/>
				<span class="message">{{ item.message }}</span>
				<button
					v-if="item.undo"
					type="button"
					class="undo"
					@click="undo(item.id)"
				>
					{{ config.texts.undo }}
					<LnxKbd combo="mod+z" />
				</button>
				<button
					type="button"
					class="close"
					:aria-label="config.texts.close"
					@click="dismiss(item.id)"
				>
					<LnxIcon
						icon="lucide:x"
						:size="16"
					/>
				</button>
				<!-- Its time runs out with this bar, which stops while it's pointed at or focused -->
				<span
					v-if="Number.isFinite(item.duration)"
					class="timer"
					:style="{ animationDuration: `${item.duration}ms` }"
					@animationend="dismiss(item.id)"
				/>
			</li>
		</TransitionGroup>
	</Teleport>
</template>

<style lang="scss">
.lnx-toaster {
	position: fixed;
	z-index: calc(var(--lnx-zindex-modal) + 1);
	bottom: var(--lnx-spacing-5);
	left: 50%;
	width: min(440px, 100vw - 2 * var(--lnx-spacing-4));
	margin: 0;
	padding: 0;
	translate: -50% 0;
	display: flex;
	flex-direction: column;
	gap: var(--lnx-spacing-2);
	list-style: none;
	pointer-events: none;
}

.lnx-toast {
	/* Inverted, so it stands out on the page in light and dark */
	--lnx-toast-background: var(--lnx-color-text);
	--lnx-toast-color: var(--lnx-color-bg);

	position: relative;
	overflow: hidden;
	padding: var(--lnx-spacing-3) var(--lnx-spacing-3) var(--lnx-spacing-3) var(--lnx-spacing-4);
	display: flex;
	align-items: center;
	gap: var(--lnx-spacing-3);
	border-radius: var(--lnx-surface-radius);
	background: var(--lnx-toast-background);
	color: var(--lnx-toast-color);
	box-shadow: var(--lnx-elevation-4);
	font-size: var(--lnx-font-size-small);
	pointer-events: auto;
	/* Transitions, not keyframes: one that leaves while it enters turns back from where it is */
	transition: opacity .22s ease-out, translate .3s ease-out, scale .3s ease-out;

	@each $variant in primary, danger, warning, success, info {
		&.toast-variant-#{$variant} {
			--lnx-toast-background: var(--lnx-color-#{$variant});
			--lnx-toast-color: var(--lnx-color-#{$variant}-accent);
		}
	}

	> iconify-icon {
		flex-shrink: 0;
	}

	.message {
		flex: 1;
		text-wrap: pretty;
	}

	button {
		display: inline-flex;
		align-items: center;
		border: none;
		background: none;
		color: inherit;
		font: inherit;
		cursor: pointer;

		&:hover {
			background: color-mix(in srgb, currentColor 14%, transparent);
		}

		&:focus-visible {
			outline-color: currentColor;
		}
	}

	.undo {
		padding: var(--lnx-spacing-1) var(--lnx-spacing-2);
		gap: var(--lnx-spacing-2);
		border-radius: var(--lnx-radius-2);
		font-weight: var(--lnx-font-weight-bold);
	}

	.close {
		padding: var(--lnx-spacing-1);
		border-radius: var(--lnx-radius-circle);
		opacity: .7;

		&:hover,
		&:focus-visible {
			opacity: 1;
		}
	}

	.timer {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 2px;
		transform-origin: left;
		background: color-mix(in srgb, currentColor 35%, transparent);
		animation: lnx-toast-run-out linear forwards;
	}

	/* Nobody loses a toast while reading it */
	&:hover .timer,
	&:focus-within .timer {
		animation-play-state: paused;
	}

	&.v-enter-from,
	&.v-leave-to {
		opacity: 0;
		translate: 0 16px;
		scale: .96;
	}

	&.v-leave-active {
		position: absolute;
		width: 100%;
	}

	&.v-move {
		transition: translate .3s ease-out;
	}
}

@keyframes lnx-toast-run-out {
	to {
		transform: scaleX(0);
	}
}

@media (prefers-reduced-motion: reduce) {
	.lnx-toast {
		transition-property: opacity;

		&.v-enter-from,
		&.v-leave-to {
			translate: none;
			scale: 1;
		}

		&.v-move {
			transition: none;
		}
	}
}
</style>
