<script setup lang="ts">
import { Year } from './types';
import DatePickerItem from './DatePickerItem.vue';

withDefaults(defineProps<{
	displayedDecade: Year[]; /* Year to be displayed */
	monthsNames?: string[]; /* Names of months to be shown */
}>(), { monthsNames: () => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] });

defineEmits<{ yearSelected: [year: Year]; }>();

function getYearsRow(year: Year[], index: number) {
	return year.slice((index - 1) * 3, index * 3);
}
</script>

<template>
	<table class="date-picker-view">
		<tbody>
			<tr
				v-for="n in 4"
				:key="n"
			>
				<DatePickerItem
					v-for="(year, yearIndex) in getYearsRow(displayedDecade, n)"
					:key="yearIndex"
					:item="year"
					@select="$emit('yearSelected', $event as Year)"
				>
					{{ year.number }}
				</DatePickerItem>
			</tr>
		</tbody>
	</table>
</template>

<style scoped lang="scss">
@import "./date-picker-view";
</style>