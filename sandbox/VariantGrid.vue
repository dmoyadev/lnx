<script setup lang="ts" generic="T extends Record<string, readonly unknown[]>">
import { computed } from 'vue';

type Combo = { [K in keyof T]: T[K][number] };

const props = defineProps<{ axes: T }>();
defineSlots<{ default(props: Combo): unknown }>();

// Cartesian product of every axis: { a: [1, 2], b: [x] } -> [{ a: 1, b: x }, { a: 2, b: x }]
const combos = computed(() => Object.entries(props.axes).reduce<Record<string, unknown>[]>(
	(acc, [key, values]) => acc.flatMap(combo => values.map(value => ({
		...combo,
		[key]: value,
	}))),
	[{}],
) as Combo[]);

function label(combo: Combo) {
	return Object.entries(combo)
		.filter(([, value]) => value !== false)
		.map(([key, value]) => value === true ? key.replace(/[A-Z]/g, m => ` ${m.toLowerCase()}`) : String(value))
		.join(' · ') || 'default';
}
</script>

<template>
	<div class="grid">
		<div
			v-for="(combo, i) in combos"
			:key="i"
			class="cell"
			:data-label="label(combo)"
		>
			<slot v-bind="combo" />
		</div>
	</div>
</template>
