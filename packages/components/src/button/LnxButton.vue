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

const props = withDefaults(defineProps<{
	variant?: TButtonVariant; /* Palette of colors */
	mode?: TButtonMode; /* Shape of the button */
	size?: TButtonSize; /* Spacing and font sizing */
	shape?: TButtonShape; /* Reimagines the button */
	to?: string | object; /* Converts the button in a router-link with the given route */
	href?: string; /* Converts the button in an anchor tag */
	isLoading?: boolean; /* When loading, it is disabled and shows a different content */
	isBlock?: boolean; /* Indicates if the button should take the full width of its container */
}>(), {
	variant: ButtonVariants.PRIMARY,
	mode: ButtonModes.SOLID,
	size: ButtonSizes.MEDIUM,
	shape: ButtonShapes.NORMAL,
	to: undefined,
	href: undefined,
});

defineSlots<{
	default(): unknown; /* Actual content of the button */
	prepend(): unknown; /* Icon that should be prepended to the content */
	append(): unknown; /* Icon that should be appended to the content */
	loading(): unknown; /* Displayed content when the button is loading */
}>();

const $attrs = useAttrs();
const isDisabled = computed(() => 'disabled' in $attrs && ($attrs.disabled || $attrs.disabled === ''));

/* Ripple effect */
// This effect needs the button to have a position property set to relative or absolute so that the ripple element
// can be positioned absolutely, as well as hiding the overflow of the button.
const $button = ref<HTMLButtonElement | HTMLAnchorElement | ComponentPublicInstance>();
const isRouterLink = (element: typeof $button.value): element is ComponentPublicInstance => Boolean(props.to) && (element as { $el: Element }).$el?.tagName === 'A';
function createRippleEffect(event: MouseEvent) {
	if (!$button.value) {
		return;
	}

	const button = isRouterLink($button.value) ? $button.value.$el : $button.value;
	if (!button || isDisabled.value) {
		return;
	}

	const circle = document.createElement('span');
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
}
</script>

<template>
	<component
		:is="href ? 'a' : (to ? 'router-link' : 'button')"
		ref="$button"
		v-bind="$attrs"
		:to="to"
		:disabled="!!isLoading"
		:class="{
			[`button-variant-${variant}`]: true,
			[`button-mode-${mode}`]: true,
			[`button-size-${size}`]: true,
			[`button-shape-${shape}`]: true,
			'is-block': isBlock,
			'is-disabled': isLoading || isDisabled,
		}"
		@click="createRippleEffect($event)"
	>
		<slot
			v-if="isLoading"
			name="loading"
		>
			<!-- TODO Add loading icon -->
		</slot>

		<template v-else>
			<slot name="prepend" />

			<slot />

			<slot name="append" />
		</template>
	</component>
</template>

<style scoped lang="scss">
@use 'sass:color';

button,
a,
router-link {
	--lnx-button-content-gap: 8px;

	position: relative; /* Required for the ripple effect */
	overflow: hidden; /* Required for the ripple effect */
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: var(--lnx-button-content-gap);
	text-align: center;
	border: 1px solid;
	border-radius: var(--lnx-radius-2);

	&:hover:not(.is-disabled):not(.button-mode-link) {
		box-shadow: var(--lnx-elevation-1);
	}

	&.button-variant- {
		&primary {
			background: var(--lnx-color-primary);
			color: var(--lnx-color-primary-accent);
			border-color: var(--lnx-color-primary);
		}

		&grayscale {
			background: var(--lnx-color-gray-0);
			color: var(--lnx-color-gray-9);
			border-color: var(--lnx-color-gray-9);
		}

		&danger {
			background: var(--lnx-color-danger);
			color: var(--lnx-color-danger-accent);
			border-color: var(--lnx-color-danger);
		}
	}

	&.button-mode- {
		&outline {
			border: 1px solid;
			background: none;

			&.button-variant- {
				&primary {
					color: var(--lnx-color-primary);
				}

				&grayscale {
					color: var(--lnx-color-gray-9);
				}

				&danger {
					color: var(--lnx-color-danger);
				}
			}
		}

		&clear {
			border-color: transparent;
			background: none;

			&.button-variant- {
				&primary {
					color: var(--lnx-color-primary);
				}

				&grayscale {
					color: var(--lnx-color-gray-9);
				}

				&danger {
					color: var(--lnx-color-danger);
				}
			}
		}

		&link {
			border-color: transparent;
			background: none;

			&:hover:not(.is-disabled) {
				text-decoration: underline;
			}

			&.button-variant- {
				&primary {
					color: var(--lnx-color-primary);
				}

				&grayscale {
					color: var(--lnx-color-gray-9);
				}

				&danger {
					color: var(--lnx-color-danger);
				}
			}
		}
	}

	&.button-size- {
		&small {
			--lnx-button-size: 26px;
			min-height: 32px;
			padding: var(--lnx-spacing-0) var(--lnx-spacing-2);
			font-size: var(--lnx-font-size-small);
		}

		&medium {
			--lnx-button-size: 40px;
			min-height: 40px;
			padding: var(--lnx-spacing-1) var(--lnx-spacing-3);
		}

		&large {
			--lnx-button-size: 42px;
			min-height: 48px;
			padding: var(--lnx-spacing-2) var(--lnx-spacing-5);
		}
	}

	&.button-shape- {
		&icon {
			padding: var(--lnx-spacing-0);
			width: var(--lnx-button-size);
			max-width: var(--lnx-button-size);
			height: var(--lnx-button-size);
			max-height: var(--lnx-button-size);
		}
	}

	&.is-block {
		width: 100%;
		flex: 1;
		display: flex;
	}

	&.is-disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
}

:global(.ripple) {
	position: absolute;
	border-radius: 50%;
	transform: scale(0);
	animation: ripple 600ms linear;
	background-color: rgba(255, 255, 255, .3);

	@keyframes ripple {
		to {
			transform: scale(4);
			opacity: 0;
		}
	}
}
</style>