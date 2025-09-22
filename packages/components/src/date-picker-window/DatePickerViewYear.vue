<script setup lang="ts">
import { Month } from './types';
import DatePickerItem from './DatePickerItem.vue';

withDefaults(defineProps<{
	displayedYear: Month[]; /* Year to be displayed */
	monthsNames?: string[]; /* Names of months to be shown */
}>(), { monthsNames: () => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] });

defineEmits<{ monthSelected: [month: Month]; }>();

function getMonthsRow(item: Month[], index: number) {
	return item.slice((index - 1) * 3, index * 3);
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
					v-for="(month, monthIndex) in getMonthsRow(displayedYear, n)"
					:key="monthIndex"
					:item="month"
					@select="$emit('monthSelected', $event as Month)"
				>
					{{ monthsNames![month.number].substring(0, 3) }}
				</DatePickerItem>
			</tr>
		</tbody>
	</table>
</template>

<style scoped lang="scss">
@import "./date-picker-view";
</style>