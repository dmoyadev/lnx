<script setup lang="ts">
import { Day, DisplayedMonth } from './types';
import { ref, watch } from 'vue';
import DatePickerItem from './DatePickerItem.vue';

const props = withDefaults(defineProps<{
	displayedMonth: DisplayedMonth; /* Month to be displayed */
	weekDaysNames?: string[]; /* Names of week days to be shown in the header of the month */
	firstDayOfWeek?: number; /* Day to be used as the start of the week */
}>(), {
	weekDaysNames: () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	firstDayOfWeek: 1,
});

defineEmits<{ daySelected: [day: Day]; }>();

const orderedWeekDaysNames = ref<string[]>(props.weekDaysNames);
watch(() => props.weekDaysNames, () => {
	for(let i = 0; i < props.firstDayOfWeek; i++) {
		orderedWeekDaysNames.value.push(orderedWeekDaysNames.value.shift() as string);
	}
});

</script>

<template>
	<table class="date-picker-view">
		<thead>
			<tr>
				<th
					v-for="day in orderedWeekDaysNames"
					:key="day"
				>
					{{ day }}
				</th>
			</tr>
		</thead>

		<tbody>
			<tr
				v-for="(week, weekIndex) in displayedMonth.daysInWeeks"
				:key="weekIndex"
			>
				<DatePickerItem
					v-for="(day, dayIndex) in week"
					:key="dayIndex"
					:item="day"
					:class="{ 'is-not-current-view': day.month !== displayedMonth.month || day.isDisabled }"
					@select="$emit('daySelected', $event as Day)"
				>
					{{ day.number }}
				</DatePickerItem>
			</tr>
		</tbody>
	</table>
</template>

<style scoped lang="scss">
@import "./date-picker-view";

.is-not-current-view {
	color: var(--lnx-color-gray-5);
}
</style>