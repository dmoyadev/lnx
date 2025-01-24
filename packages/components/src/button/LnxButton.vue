<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import { computed, ref, useAttrs } from 'vue';
import type {
	TButtonVariant,
	TButtonSize,
	TButtonMode,
	TButtonShape,
} from './types';
import {
	ButtonVariants,
	ButtonSizes,
	ButtonModes,
	ButtonShapes,
} from './types';

const props = withDefaults(defineProps<{
	variant?: TButtonVariant; /* The variant of the button */
	mode?: TButtonMode; /* The mode of the button */
	size?: TButtonSize; /* The size of the button */
	shape?: TButtonShape; /* The shape of the button */
	to?: string | object; /* Converts the button in a router-link with the given route */
	href?: string; /* Converts the button in an anchor tag */
	isLoading?: boolean; /* Indicates if the button is loading */
	isBlock?: boolean; /* Indicates if the button should take the full width of its container */
}>(), {
	variant: ButtonVariants.PRIMARY,
	mode: ButtonModes.SOLID,
	size: ButtonSizes.MEDIUM,
	shape: ButtonShapes.NORMAL,
	to: undefined,
	href: undefined,
});

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
		ref="element"
		v-bind="$attrs"
		:to="to"
		:disabled="!!isLoading"
		:class="{
			[`button-variant-${variant}`]: true,
			[`button-mode-${mode}`]: true,
			[`button-size-${size}`]: true,
			[`button-shape-${shape}`]: true,
			'button-disabled': isLoading || isDisabled,
		}"
		@click="createRippleEffect($event)"
	>
		<!-- @slot Content of a loading button -->
		<slot
			v-if="isLoading"
			name="loading"
		>
			<!-- TODO Add loading icon -->
		</slot>
		
		<template v-else>
			<!-- @slot Prepended icon -->
			<slot name="prepend">
				<!-- TODO Add prepend icon -->
			</slot>

			<!-- @slot Content of the button -->
			<slot />

			<!-- @slot Appended icon -->
			<slot name="append">
				<!-- TODO Add append icon -->
			</slot>
		</template>
	</component>
</template>

<style scoped lang="scss">
button {
	--lnx-button-bg-color: var(--lnx-color-primary);

	&.button-variant-primary {
		background-color: var(--lnx-button-bg-color);
	}
}
</style>