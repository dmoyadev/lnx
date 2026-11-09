<script setup lang="ts">
import { computed } from 'vue';
import { SKELETON_VARIANTS, SkeletonVariant } from './types';

const props = withDefaults(defineProps<{
	variant?: SkeletonVariant; /* The shape: a line of text, a title, small text, a circle or a rectangle */
	lines?: number; /* Number of lines, for a paragraph. The last one is shorter */
	width?: string; /* Any CSS width. By default, the whole width, or `size` */
	height?: string; /* Any CSS height. By default, the height of the text of the variant, or `size` */
	size?: string; /* Width and height at once, for circles and squares */
}>(), {
	variant: SKELETON_VARIANTS.TEXT,
	lines: 1,
	width: undefined,
	height: undefined,
	size: undefined,
});

const style = computed(() => ({
	width: props.width ?? props.size,
	height: props.height ?? props.size,
}));
</script>

<template>
	<span
		v-if="lines > 1"
		class="lnx-skeleton-lines"
		:style="{ width }"
		aria-hidden="true"
	>
		<span
			v-for="line in lines"
			:key="line"
			:class="['lnx-skeleton', `lnx-skeleton--${variant}`]"
			:style="{ height, width: line === lines ? '60%' : undefined }"
		/>
	</span>
	<span
		v-else
		:class="['lnx-skeleton', `lnx-skeleton--${variant}`]"
		:style
		aria-hidden="true"
	/>
</template>
