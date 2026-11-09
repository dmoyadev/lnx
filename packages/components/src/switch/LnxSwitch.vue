<script setup lang="ts">
import { computed, ref, useAttrs, useId } from 'vue';
import { LnxIcon } from '../icon';
import { SWITCH_LABEL_POSITIONS, SwitchLabelPosition } from './types';

withDefaults(defineProps<{
	isLoading?: boolean; /* When loading, it is disabled and the thumb shows a spinner */
	labelPosition?: SwitchLabelPosition; /* The label before the switch, with the switch at the end of the row as in settings, or after it */
}>(), {
	labelPosition: SWITCH_LABEL_POSITIONS.END,
});

defineSlots<{
	default(): unknown; /* The label of the switch */
	helper(): unknown; /* The helper message of the switch */
}>();

/* Whether the switch is on */
const model = defineModel<boolean>();

// $attrs go to the <input>; only class and style stay on the wrapper
defineOptions({ inheritAttrs: false });

const $attrs = useAttrs();
const id = useId();
const helperId = `${id}-helper`;
const inputAttrs = computed(() => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { class: _class, style, ...rest } = $attrs;
	return rest;
});

const $input = ref<HTMLInputElement>();
defineExpose({ $input });
</script>

<template>
	<div
		class="lnx-switch"
		:class="[$attrs.class, `is-label-${labelPosition}`]"
		:style="$attrs.style"
	>
		<label>
			<span class="track">
				<input
					v-bind="inputAttrs"
					:id="($attrs.id as string) || id"
					ref="$input"
					v-model="model"
					type="checkbox"
					role="switch"
					:disabled="isLoading || ($attrs.disabled as boolean | undefined)"
					:aria-busy="isLoading || undefined"
					:aria-describedby="$slots.helper ? helperId : undefined"
				>
				<span class="thumb">
					<LnxIcon
						v-if="isLoading"
						icon="line-md:loading-loop"
						:size="12"
					/>
				</span>
			</span>
			<span
				v-if="!!$slots.default"
				class="text"
			>
				<slot />
			</span>
		</label>

		<p
			v-if="!!$slots.helper"
			:id="helperId"
			class="helper"
		>
			<slot name="helper" />
		</p>
	</div>
</template>

<style scoped lang="scss">
@use '../field';

.lnx-switch {
	--lnx-switch-height: calc(var(--lnx-control-height) * .6);
	--lnx-switch-thumb: calc(var(--lnx-switch-height) - 4px);

	display: flex;
	flex-direction: column;
	gap: var(--lnx-control-gap);

	label {
		display: inline-flex;
		align-items: flex-start;
		gap: var(--lnx-spacing-2);
		font-size: var(--lnx-control-font-size);
		line-height: 1.4;
		cursor: pointer;

		&:has(input:disabled) {
			cursor: default;
		}

		&:has(input:disabled:not([aria-busy])) {
			opacity: .5;
		}
	}

	/* The label first and the switch at the end of the row, as in a list of settings */
	&.is-label-start label {
		flex-direction: row-reverse;
		justify-content: space-between;
	}

	/* As tall as a line of the label, or the switch if taller, so it sits on the first line when the label wraps */
	.track {
		position: relative;
		min-height: 1lh;
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
	}

	input {
		width: calc(var(--lnx-switch-height) * 1.75);
		height: var(--lnx-switch-height);
		margin: 0;
		border: none;
		border-radius: var(--lnx-radius-5);
		background: var(--lnx-color-border);
		appearance: none;
		cursor: inherit;
		transition: background .2s;

		&:checked {
			background: var(--lnx-color-primary);
		}

		&:focus-visible {
			outline: 2px solid var(--lnx-color-primary);
			outline-offset: 2px;
		}
	}

	.thumb {
		position: absolute;
		left: 2px;
		width: var(--lnx-switch-thumb);
		height: var(--lnx-switch-thumb);
		display: grid;
		place-items: center;
		border-radius: var(--lnx-radius-circle);
		background: var(--lnx-color-gray-0);
		color: var(--lnx-color-gray-10);
		box-shadow: var(--lnx-elevation-1);
		pointer-events: none;
		transition: translate .2s ease;
	}

	input:checked + .thumb {
		translate: calc(var(--lnx-switch-height) * .75) 0;
	}
}

@media (prefers-reduced-motion: reduce) {
	.lnx-switch :is(input, .thumb) {
		transition: none;
	}
}
</style>
