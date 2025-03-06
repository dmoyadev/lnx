<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import { computed, ref, useAttrs } from 'vue';
import type {
	TButtonVariant,
	TButtonMode,
	TButtonSize,
	TButtonShape,
} from './types';
import {
	ButtonVariants,
	ButtonModes,
	ButtonSizes,
	ButtonShapes,
} from './types';
import { LnxIcon } from '../icon';

const props = withDefaults(defineProps<{
	variant?: TButtonVariant; /* Applies different palette of colors */
	mode?: TButtonMode; /* Display mode. Recommended for changing the importance */
	size?: TButtonSize; /* Modifies spacing and font sizing */
	shape?: TButtonShape; /* Reimagines how it\'s built */
	href?: string; /* Converts the button in an anchor tag with the given URL */
	to?: string | object; /* Converts the button in a router-link with the given route. If `href` is set, this is ignored. */
	isLoading?: boolean; /* When loading, it is disabled and shows a different content */
	isBlock?: boolean; /* Indicates if the button should take the full width of its container */
}>(), {
	variant: ButtonVariants.PRIMARY,
	mode: ButtonModes.SOLID,
	size: ButtonSizes.MEDIUM,
	shape: ButtonShapes.NORMAL,
	href: undefined,
	to: undefined,
});

defineSlots<{
	default(): unknown; /* Actual content of the button */
	loading(): unknown; /* Displayed content when the button is loading */
	prefix(): unknown; /* Icon that should be prefixed to the content */
	suffix(): unknown; /* Icon that should be suffixed to the content */
}>();

const $attrs = useAttrs();
const isDisabled = computed(() => props.isLoading || ('disabled' in $attrs && ($attrs.disabled || $attrs.disabled === '')));

/* Ripple effect */
// This effect needs the button to have a position property set to relative or absolute so that the ripple element
// can be positioned absolutely, as well as hiding the overflow of the button.
const RIPPLE_DURATION = 600;
const $button = ref<HTMLButtonElement | HTMLAnchorElement | ComponentPublicInstance>();
const isRouterLink = (element: typeof $button.value): element is ComponentPublicInstance => Boolean(props.to) && (element as { $el: Element }).$el?.tagName === 'A';
function createRippleEffect(event: MouseEvent) {
	if (!$button.value) {
		return;
	}

	const button = isRouterLink($button.value) ? $button.value.$el : $button.value;
	if (!document || !button || isDisabled.value) {
		return;
	}

	const circle = document?.createElement('span');
	const diameter = Math.max(button.clientWidth, button.clientHeight);
	const radius = diameter / 2;

	circle.style.width = circle.style.height = `${diameter}px`;
	const buttonPosition = button.getBoundingClientRect();
	circle.style.left = `${event.clientX - buttonPosition.left - radius}px`;
	circle.style.top = `${event.clientY - buttonPosition.top - radius}px`;
	circle.classList.add('ripple');

	const ripple = button.getElementsByClassName('ripple')[0];

	if (ripple) {
		ripple.remove();
	}

	button.appendChild(circle);

	setTimeout(() => circle.remove(), RIPPLE_DURATION);
}
</script>

<template>
	<component
		:is="href ? 'a' : (to ? 'router-link' : 'button')"
		ref="$button"
		v-bind="$attrs"
		:href="href"
		:to="!!href ? undefined : to"
		:disabled="isDisabled"
		:aria-disabled="isDisabled"
		:class="{
			[`button-variant-${variant}`]: true,
			[`button-mode-${mode}`]: true,
			[`button-size-${size}`]: true,
			[`button-shape-${shape}`]: true,
			'is-block': isBlock,
			'is-disabled': isDisabled,
			'is-loading': isLoading,
		}"
		@click="createRippleEffect($event)"
	>
		<span
			v-if="isLoading"
			class="loading-content"
		>
			<slot name="loading">
				<LnxIcon icon="line-md:loading-loop" />
			</slot>
		</span>

		<slot name="prefix" />

		<slot />

		<slot name="suffix" />
	</component>
</template>

<style scoped lang="scss">
@use 'sass:color';

button,
a,
router-link {
	--lnx-button-content-gap: 8px;
	--lnx-button-border: 1px solid;
	--lnx-button-border-color: var(--lnx-color-gray-3);
	--lnx-button-border-radius: var(--lnx-radius-2);
	--lnx-button–box-shadow: var(--lnx-elevation-2);
	--lnx-button-background: var(--lnx-color-gray-0);
	--lnx-button-color: var(--lnx-color-gray-8);
	--lnx-button-padding: var(--lnx-spacing-1) var(--lnx-spacing-3);
	--lnx-button-size: 40px;

	position: relative; /* Required for the ripple effect */
	overflow: hidden; /* Required for the ripple effect */
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: var(--lnx-button-content-gap);
	text-align: center;
	border: var(--lnx-button-border);
	border-radius: var(--lnx-button-border-radius);

	background: var(--lnx-button-background);
	color: var(--lnx-button-color);
	border-color: var(--lnx-button-border-color);

	min-height: var(--lnx-button-size);
	padding: var(--lnx-button-padding);

	&:hover:not(.is-disabled):not(.button-mode-clear, .button-mode-link) {
		box-shadow: var(--lnx-button–box-shadow);
	}

	&.button-variant- {
		&primary {
			--lnx-button-background: var(--lnx-color-primary);
			--lnx-button-color: var(--lnx-color-primary-accent);
			--lnx-button-border-color: var(--lnx-color-primary);
		}

		&grayscale {
			--lnx-button-background: var(--lnx-color-gray-0);
			--lnx-button-color: var(--lnx-color-gray-6);
			--lnx-button-border-color: var(--lnx-color-gray-3);
		}

		&danger {
			--lnx-button-background: var(--lnx-color-danger);
			--lnx-button-color: var(--lnx-color-danger-accent);
			--lnx-button-border-color: var(--lnx-color-danger);
		}

		&warning {
			--lnx-button-background: var(--lnx-color-warning);
			--lnx-button-color: var(--lnx-color-warning-accent);
			--lnx-button-border-color: var(--lnx-color-warning);
		}

		&success {
			--lnx-button-background: var(--lnx-color-success);
			--lnx-button-color: var(--lnx-color-success-accent);
			--lnx-button-border-color: var(--lnx-color-success);
		}

		&info {
			--lnx-button-background: var(--lnx-color-info);
			--lnx-button-color: var(--lnx-color-info-accent);
			--lnx-button-border-color: var(--lnx-color-info);
		}
	}

	&.button-mode- {
		&outline {
			--lnx-button-background: none;

			&.button-variant- {
				&primary {
					--lnx-button-color: var(--lnx-color-primary);
				}

				&grayscale {
					--lnx-button-color: var(--lnx-color-gray-8);
				}

				&danger {
					--lnx-button-color: var(--lnx-color-danger);
				}

				&warning {
					--lnx-button-color: var(--lnx-color-warning);
				}

				&success {
					--lnx-button-color: var(--lnx-color-success);
				}

				&info {
					--lnx-button-color: var(--lnx-color-info);
				}
			}
		}

		&clear {
			--lnx-button-border-color: transparent;
			--lnx-button-background: none;

			&:hover:not(.is-disabled) {
				opacity: .8;
			}

			&.button-variant- {
				&primary {
					--lnx-button-color: var(--lnx-color-primary);
				}

				&grayscale {
					--lnx-button-color: var(--lnx-color-gray-8);
				}

				&danger {
					--lnx-button-color: var(--lnx-color-danger);
				}

				&warning {
					--lnx-button-color: var(--lnx-color-warning);
				}

				&success {
					--lnx-button-color: var(--lnx-color-success);
				}

				&info {
					--lnx-button-color: var(--lnx-color-info);
				}
			}
		}

		&link {
			--lnx-button-border-color: transparent;
			--lnx-button-background: none;

			&:hover:not(.is-disabled) {
				text-decoration: underline;
			}

			&.button-variant- {
				&primary {
					--lnx-button-color: var(--lnx-color-primary);
				}

				&grayscale {
					--lnx-button-color: var(--lnx-color-gray-8);
				}

				&danger {
					--lnx-button-color: var(--lnx-color-danger);
				}

				&warning {
					--lnx-button-color: var(--lnx-color-warning);
				}

				&success {
					--lnx-button-color: var(--lnx-color-success);
				}

				&info {
					--lnx-button-color: var(--lnx-color-info);
				}
			}
		}
	}

	&.button-size- {
		&small {
			--lnx-button-size: 26px;
			--lnx-button-padding: var(--lnx-spacing-0) var(--lnx-spacing-2);
			font-size: var(--lnx-font-size-small);
		}

		&medium {
			--lnx-button-size: 40px;
			--lnx-button-padding: var(--lnx-spacing-1) var(--lnx-spacing-3);
		}

		&large {
			--lnx-button-size: 52px;
			--lnx-button-padding: var(--lnx-spacing-2) var(--lnx-spacing-5);
		}
	}

	&.button-shape- {
		&icon,
		&circle {
			--lnx-button-padding: var(--lnx-spacing-0);
			width: var(--lnx-button-size);
			max-width: var(--lnx-button-size);
			height: var(--lnx-button-size);
			max-height: var(--lnx-button-size);
		}

		&circle {
			border-radius: 50%;
		}
	}

	&.is-block {
		width: 100%;
		flex: 1;
		display: flex;
	}

	&.is-disabled {
		cursor: not-allowed;
		pointer-events: none;
		opacity: 0.5;
	}

	&.is-loading {
		position: relative;

		.loading-content {
			position: absolute;
			inset: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		> *:not(.loading-content) {
			opacity: 0;
		}
	}
}

:global(.ripple) {
	position: absolute;
	border-radius: 50%;
	transform: scale(0);
	animation: ripple v-bind('`${RIPPLE_DURATION}ms`') linear;
	background-color: rgba(255, 255, 255, .3);

	@keyframes ripple {
		to {
			transform: scale(4);
			opacity: 0;
		}
	}
}
</style>