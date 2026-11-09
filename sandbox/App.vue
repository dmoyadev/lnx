<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
	LnxButton,
	BUTTON_VARIANTS,
	BUTTON_MODES,
	LnxInput,
	LnxIcon,
	LnxInputOTP,
	LnxModal,
	LnxDatePicker,
	CALENDAR_VIEW_TYPES,
	LnxDatePickerWindow,
	LnxSelect,
	LnxFileUploader,
	LnxSkeleton,
	useConfirm,
	LnxKbd,
	LnxShortcutsSheet,
	useShortcut,
	shortcutTitle,
	toast,
	dismiss,
	toasts,
	LnxCheckbox,
} from 'lnxjs-components/src';
import VariantGrid from './VariantGrid.vue';

const COMPONENTS = {
	'button': 'LnxButton',
	'input': 'LnxInput',
	'input-otp': 'LnxInputOTP',
	'modal': 'LnxModal',
	'date-picker': 'LnxDatePicker',
	'date-picker-window': 'LnxDatePickerWindow',
	'select': 'LnxSelect',
	'file-uploader': 'LnxFileUploader',
	'checkbox': 'LnxCheckbox',
	'toaster': 'toast',
	'shortcuts': 'useShortcut',
	'confirm': 'useConfirm',
	'skeleton': 'LnxSkeleton',
};

// Empty means "all"; kept in the URL hash so a reload stays on the same component
const show = ref(location.hash.slice(1));
watch(show, value => history.replaceState(null, '', value ? `#${value}` : location.pathname));
const isShown = (id: string) => !show.value || show.value === id;

const inputModel = ref('');
const inputOTPModel = ref<string>('');
const datePickerWindowModel = ref<Date>();
const datePickerWindowStartModel = ref<Date>();
const datePickerWindowEndModel = ref<Date>();
const datePickerModel = ref<Date>();
const datePickerStartModel = ref<Date>();
const datePickerEndModel = ref<Date>();
const isoDateModel = ref('');
const isoStartModel = ref('');
const isoEndModel = ref('');
const selectModel = ref();
const emptyValuesOptions = [{ value: '', label: 'All' }, { value: 0, label: 'None' }, { value: 1, label: 'One' }];
const emptyValuesModel = ref<string | number | null>('');
const bodyLineHeight = ref('');
function toggleLineHeight() {
	bodyLineHeight.value = bodyLineHeight.value === '1.5' ? 'normal' : '1.5';
	document.body.style.lineHeight = bodyLineHeight.value;
}
const fileUploaderModel = ref();

const selectOptions: { id:number, label: string, value: unknown }[] = Array.from({ length: 13 }, (_, i) => ({
	id: i + 1,
	label: i === 1 ? 'Option 2a sasdf asdf asdf asf asf asdfasf asf asf asdf as fasf asfas fasdfs' : `Option ${i + 1}`,
	value: i + 1,
}));
const asyncSelectOptions = ref();
const loadingSelectOptions = ref(false);
async function getAsyncOptions() {
	asyncSelectOptions.value = [];
	loadingSelectOptions.value = true;
	return new Promise(() => {
		setTimeout(() => {
			loadingSelectOptions.value = false;
			asyncSelectOptions.value = selectOptions;
		}, 1000);
	});
}
const bool = [false, true] as const;
const calendarTypes = Object.values(CALENDAR_VIEW_TYPES);

function toggleDarkMode() {
	document.documentElement.classList.toggle('dark');
}

const skeletonLoading = ref(true);

const confirm = useConfirm();
const confirmAnswers = ref<string[]>([]);
async function askDelete() {
	const confirmed = await confirm({ title: 'Delete «Minutes 2026»?', message: "It can't be undone.", confirmText: 'Delete', variant: 'danger' });
	confirmAnswers.value.push(`delete: ${confirmed}`);
}
async function askPublish() {
	confirmAnswers.value.push(`publish: ${await confirm('Publish the minutes for all the members?')}`);
}
async function askThree() {
	const answers = await Promise.all([1, 2, 3].map(n => confirm({ title: `Question ${n} of 3`, message: 'They are answered one after the other.' })));
	confirmAnswers.value.push(`three: ${answers.join('/')}`);
}

const shortcutLog = ref<string[]>([]);
const shortcutText = ref('');
const isEditingShortcut = ref(false);
useShortcut('n', () => shortcutLog.value.push('new'), { description: 'New receipt' });
useShortcut('mod+enter', () => shortcutLog.value.push('save'), { description: 'Save' });
useShortcut('mod+s', () => shortcutLog.value.push('save (s)'), { description: 'Save' });
useShortcut('g i', () => shortcutLog.value.push('go to incidents'), { description: 'Go to incidents' });
useShortcut('escape', () => { shortcutLog.value.push('cancel edit'); isEditingShortcut.value = false; }, { description: 'Cancel', enabled: () => isEditingShortcut.value });

const toastReceipts = ref(3);
async function failingUndo() {
	throw new Error('the server said no');
}
function toastSave() {
	toastReceipts.value++;
	toast(`Receipt saved. You have ${toastReceipts.value}`, { undo: () => { toastReceipts.value--; } });
}

const checkboxBool = ref(false);
const checkboxTerms = ref(false);
const checkboxSubmitted = ref(false);
const checkboxList = ref<string[]>(['email']);
const checkboxAll = computed({
	get: () => checkboxList.value.length === 3,
	set: (checked: boolean) => { checkboxList.value = checked ? ['email', 'sms', 'push'] : []; },
});

</script>

<template>
	<header class="header">
		<nav class="nav">
			<LnxButton
				:mode="!show ? BUTTON_MODES.SOLID : BUTTON_MODES.CLEAR"
				@click="show = ''"
			>
				All
			</LnxButton>
			<LnxButton
				v-for="(name, id) in COMPONENTS"
				:key="id"
				:mode="show === id ? BUTTON_MODES.SOLID : BUTTON_MODES.CLEAR"
				@click="show = id"
			>
				{{ name }}
			</LnxButton>
		</nav>

		<LnxButton
			:mode="BUTTON_MODES.OUTLINE"
			aria-label="Toggle dark mode"
			@click="toggleDarkMode"
		>
			🌚
		</LnxButton>
	</header>

	<main class="main">
		<section v-if="isShown('button')">
			<h2>LnxButton</h2>
			<VariantGrid
				v-slot="{ variant, mode }"
				:axes="{ variant: Object.values(BUTTON_VARIANTS), mode: Object.values(BUTTON_MODES) }"
				style="--cell-min: 200px"
			>
				<LnxButton
					:variant
					:mode
				>
					normal
				</LnxButton>
				<LnxButton
					:variant
					:mode
					disabled
				>
					disabled
				</LnxButton>
			</VariantGrid>
		</section>

		<section v-if="isShown('input')">
			<h2>LnxInput</h2>
			<form>
				<VariantGrid
					v-slot="{ type, loading, error, clearable, icon }"
					:axes="{ type: ['text', 'number', 'password'], loading: bool, error: bool, clearable: bool, icon: bool }"
				>
					<LnxInput
						v-model="inputModel"
						:type
						:is-loading="loading"
						:has-error="error"
						:is-clearable="clearable"
						placeholder="placeholder"
					>
						This is the label

						<template
							v-if="icon"
							#icon
						>
							<LnxIcon icon="mdi:magnify" />
						</template>

						<template #helper>
							This is a helper
						</template>

						<template #error>
							This is an error
						</template>
					</LnxInput>
				</VariantGrid>
			</form>
		</section>

		<section v-if="isShown('input-otp')">
			<h2>LnxInputOTP</h2>
			<form>
				<VariantGrid
					v-slot="{ error }"
					:axes="{ error: bool }"
					style="--cell-min: 340px"
				>
					<LnxInputOTP
						v-model="inputOTPModel"
						:has-error="error"
					>
						Introduce the code

						<template #helper>
							This is a helper
						</template>

						<template #error>
							This is an error
						</template>
					</LnxInputOTP>
				</VariantGrid>
			</form>
		</section>

		<section v-if="isShown('modal')">
			<h2>LnxModal</h2>
			<VariantGrid
				v-slot="{ closeButton, closeOnOverlayClick }"
				:axes="{ closeButton: bool, closeOnOverlayClick: bool }"
				style="--cell-min: 340px"
			>
				<LnxModal
					title="This is the title"
					:allow-close-on-overlay-click="closeOnOverlayClick"
					:hide-close-button="!closeButton"
				>
					<template #default="{ open }">
						<LnxButton @click="open()">
							Simple
						</LnxButton>
					</template>

					<template #icon>
						<LnxIcon
							icon="mdi:warning"
							:size="26"
							style="color: var(--lnx-color-danger)"
						/>
					</template>

					<template #content>
						This is the content
					</template>
				</LnxModal>

				<LnxModal
					title="This is the title"
					:allow-close-on-overlay-click="closeOnOverlayClick"
					:hide-close-button="!closeButton"
				>
					<template #default="{ open }">
						<LnxButton @click="open()">
							With actions
						</LnxButton>
					</template>

					<template #icon>
						<LnxIcon
							icon="mdi:warning"
							:size="26"
							style="color: var(--lnx-color-danger)"
						/>
					</template>

					<template #content>
						This is the content
					</template>

					<template #actions="{ close }">
						<LnxButton
							:variant="BUTTON_VARIANTS.GRAYSCALE"
							:mode="BUTTON_MODES.CLEAR"
						>
							A secondary action
						</LnxButton>

						<LnxButton :variant="BUTTON_VARIANTS.GRAYSCALE">
							Another action
						</LnxButton>

						<LnxButton @click="close()">
							Close
						</LnxButton>
					</template>
				</LnxModal>

				<LnxModal
					title="This is the title"
					:allow-close-on-overlay-click="closeOnOverlayClick"
					:hide-close-button="!closeButton"
				>
					<template #default="{ open }">
						<LnxButton @click="open()">
							Extra-long
						</LnxButton>
					</template>

					<template #icon>
						<LnxIcon
							icon="mdi:warning"
							:size="26"
							style="color: var(--lnx-color-danger)"
						/>
					</template>

					<template #content>
						<LnxSelect
							v-model="selectModel"
							:options="[1, 2, 3]"
						>
							Select a value
						</LnxSelect>

						<LnxDatePicker>
							Select a value
						</LnxDatePicker>

						<p
							v-for="i in 20"
							:key="i"
						>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a ligula tristique enim luctus maximus. Fusce at dolor nisi. Vivamus rhoncus nisl id mauris consectetur lobortis. Duis suscipit sapien sit amet purus varius mollis. Morbi tincidunt eleifend tristique. Sed egestas ultrices rutrum. In hac habitasse platea dictumst. Aenean eget purus eget nulla finibus lacinia. Donec porttitor eros tincidunt, accumsan libero et, gravida orci.
						</p>
					</template>

					<template #actions="{ close }">
						<LnxButton
							:variant="BUTTON_VARIANTS.GRAYSCALE"
							:mode="BUTTON_MODES.CLEAR"
						>
							A secondary action
						</LnxButton>

						<LnxButton :variant="BUTTON_VARIANTS.GRAYSCALE">
							Another action
						</LnxButton>

						<LnxButton @click="close()">
							Close
						</LnxButton>
					</template>
				</LnxModal>
			</VariantGrid>
		</section>

		<section v-if="isShown('date-picker')">
			<h2>LnxDatePicker</h2>
			<pre class="state">single: {{ datePickerModel }}&#10;start:  {{ datePickerStartModel }}&#10;end:    {{ datePickerEndModel }}</pre>
			<form>
				<VariantGrid
					v-slot="{ calendarType, range, allowDeselect }"
					:axes="{ calendarType: calendarTypes, range: bool, allowDeselect: bool }"
				>
					<LnxDatePicker
						v-model="datePickerModel"
						v-model:start="datePickerStartModel"
						v-model:end="datePickerEndModel"
						:calendar-type
						:is-range="range"
						:allow-deselect
						:is-item-disabled-fn="(item) => item?.number % 2 === 0"
					>
						This is the label

						<template #helper>
							This is a helper
						</template>

						<template #error>
							This is an error
						</template>
					</LnxDatePicker>
				</VariantGrid>
			</form>
		</section>

		<section v-if="isShown('date-picker')">
			<h3>Calendar keeps its own width</h3>
			<div style="display: flex; gap: 12px; align-items: flex-start; flex-wrap: wrap">
				<LnxDatePicker
					v-model="datePickerModel"
					is-block
					style="width: 600px; max-width: 100%"
				>
					In a 600px field
				</LnxDatePicker>
				<LnxDatePicker
					v-model="datePickerModel"
					style="width: 150px"
				>
					In a 150px field
				</LnxDatePicker>
			</div>
		</section>

		<section v-if="isShown('date-picker')">
			<h3>Text values and limits</h3>
			<pre class="state">single: {{ JSON.stringify(isoDateModel) }}&#10;start:  {{ JSON.stringify(isoStartModel) }}&#10;end:    {{ JSON.stringify(isoEndModel) }}</pre>
			<div style="display: flex; gap: 12px; align-items: flex-start; flex-wrap: wrap">
				<LnxDatePicker
					v-model="isoDateModel"
					value-format="iso-date"
					min="2026-11-05"
					:max="new Date(Date.UTC(2027, 1, 15))"
				>
					From 5 Nov 2026 to 15 Feb 2027
				</LnxDatePicker>
				<LnxDatePicker
					v-model:start="isoStartModel"
					v-model:end="isoEndModel"
					value-format="iso-date"
					is-range
					:is-item-disabled-fn="null"
				>
					Range as text
				</LnxDatePicker>
				<LnxDatePicker
					v-model="isoDateModel"
					value-format="iso-date"
					calendar-type="month"
					min="2026-11-05"
				>
					Months from November 2026
				</LnxDatePicker>
			</div>
		</section>

		<section v-if="isShown('date-picker-window')">
			<h2>LnxDatePickerWindow</h2>
			<pre class="state">single: {{ datePickerWindowModel }}&#10;start:  {{ datePickerWindowStartModel }}&#10;end:    {{ datePickerWindowEndModel }}</pre>
			<VariantGrid
				v-slot="{ calendarType, range, allowDeselect }"
				:axes="{ calendarType: calendarTypes, range: bool, allowDeselect: bool }"
				style="--cell-min: 320px"
			>
				<LnxDatePickerWindow
					v-model="datePickerWindowModel"
					v-model:start="datePickerWindowStartModel"
					v-model:end="datePickerWindowEndModel"
					:calendar-type
					:is-range="range"
					:allow-deselect
					:is-item-disabled-fn="(item) => item?.number % 2 === 0"
				/>
			</VariantGrid>
		</section>

		<section v-if="isShown('select')">
			<h2>LnxSelect</h2>
			<pre class="state">selected: {{ selectModel }}</pre>
			<form class="grid">
				<div
					class="cell"
					data-label="custom option slot"
				>
					<LnxSelect
						v-model="selectModel"
						placeholder="placeholder"
						label-property="label"
						:options="selectOptions"
					>
						This is the label

						<template #option="{ option }">
							<span style="color: var(--lnx-color-primary)">{{ option.label }} (custom option)</span>
						</template>
					</LnxSelect>
				</div>

				<div
					class="cell"
					data-label="helper"
				>
					<LnxSelect
						v-model="selectModel"
						placeholder="placeholder"
						label-property="label"
						:options="selectOptions"
					>
						This is the label

						<template #helper>
							This is a helper
						</template>
					</LnxSelect>
				</div>

				<div
					class="cell"
					data-label="error"
				>
					<LnxSelect
						v-model="selectModel"
						placeholder="placeholder"
						label-property="label"
						has-error
						:options="selectOptions"
					>
						This is the label

						<template #error>
							This is an error
						</template>
					</LnxSelect>
				</div>

				<div
					class="cell"
					data-label="helper · error"
				>
					<LnxSelect
						v-model="selectModel"
						placeholder="placeholder"
						label-property="label"
						has-error
						:options="selectOptions"
					>
						This is the label

						<template #helper>
							This is a helper
						</template>

						<template #error>
							This is an error
						</template>
					</LnxSelect>
				</div>

				<div
					class="cell"
					data-label="convert · label property"
				>
					<LnxSelect
						v-model.convert="selectModel"
						placeholder="placeholder"
						:options="selectOptions"
						label-property="label"
						:convert-fn="(value) => ({ ...value, newProperty: 'cool!' })"
					>
						With a label property
					</LnxSelect>
				</div>

				<div
					class="cell"
					data-label="convert · custom function"
				>
					<LnxSelect
						v-model.convert="selectModel"
						placeholder="placeholder"
						:options="selectOptions"
						:convert-fn="(value) => value.label + ' (converted)'"
					>
						With a custom convert function
					</LnxSelect>
				</div>

				<div
					class="cell"
					data-label="custom input slot"
				>
					<LnxSelect
						v-model="selectModel"
						placeholder="placeholder"
						:options="selectOptions"
					>
						This is the label

						<template #optionInput="{ value }">
							<span style="display: flex; align-items: center; gap: 4px;">
								<LnxIcon icon="mdi:star" />
								<span style="color: var(--lnx-color-primary)">{{ value }} (custom option) as d f a s d f a s d f asf asdf as df</span>
							</span>
						</template>
					</LnxSelect>
				</div>

				<div
					class="cell"
					data-label="async options"
				>
					<LnxSelect
						v-model="selectModel"
						placeholder="placeholder"
						:options="asyncSelectOptions"
						label-property="label"
						:loading-options="loadingSelectOptions"
						are-options-async
						@query="getAsyncOptions"
					>
						This is the label

						<template #notFound>
							<small>Start writing to see suggestions</small>
						</template>
					</LnxSelect>
				</div>

				<div
					class="cell"
					data-label="'' and 0 are values · next to an input"
				>
					<LnxSelect
						v-model.convert="emptyValuesModel"
						placeholder="placeholder"
						:options="emptyValuesOptions"
						:convert-fn="(option) => option.value"
						style="flex: 1"
					>
						Filter

						<template #option="{ option }">
							{{ option.label }}
						</template>

						<template #optionInput="{ value }">
							{{ emptyValuesOptions.find(option => option.value === value)?.label }}
						</template>
					</LnxSelect>
					<LnxInput
						placeholder="placeholder"
						style="flex: 1"
					>
						Input
					</LnxInput>
					<LnxButton
						:mode="BUTTON_MODES.OUTLINE"
						@click="emptyValuesModel = emptyValuesModel === null ? '' : (emptyValuesModel === '' ? 0 : null)"
					>
						v-model: {{ JSON.stringify(emptyValuesModel) }}
					</LnxButton>
					<LnxButton
						:mode="BUTTON_MODES.OUTLINE"
						@click="toggleLineHeight()"
					>
						body line-height: {{ bodyLineHeight }}
					</LnxButton>
				</div>
			</form>
		</section>

		<section v-if="isShown('file-uploader')">
			<h2>LnxFileUploader</h2>
			<form>
				<VariantGrid
					v-slot="{ multiple, loading, error }"
					:axes="{ multiple: bool, loading: bool, error: bool }"
					style="--cell-min: 320px"
				>
					<LnxFileUploader
						v-model="fileUploaderModel"
						:is-loading="loading"
						:has-error="error"
						:multiple
					>
						This is the label

						<template #helper>
							This is a helper
						</template>

						<template #error>
							This is an error
						</template>
					</LnxFileUploader>
				</VariantGrid>
			</form>
		</section>
		<section v-if="isShown('skeleton')">
			<h2>LnxSkeleton</h2>
			<div class="grid" style="--cell-min: 260px">
				<div :aria-busy="skeletonLoading" style="display: grid; gap: 12px">
					<template v-if="skeletonLoading">
						<LnxSkeleton variant="title" width="40%" />
						<LnxSkeleton :lines="3" />
						<LnxSkeleton variant="small" width="70%" />
					</template>
					<div v-else class="lnx-appear">
						<h3>Loaded title</h3>
						<p>The content that replaces the skeleton fades in.</p>
					</div>
				</div>
				<div style="display: flex; gap: 12px; align-items: center">
					<LnxSkeleton variant="circle" size="40px" />
					<LnxSkeleton variant="rect" height="75px" />
				</div>
				<div style="display: flex; gap: 12px; align-items: center">
					<LnxButton class="lnx-skeleton" style="width: 120px; height: var(--lnx-control-height)">Hidden</LnxButton>
					<LnxButton @click="skeletonLoading = !skeletonLoading">Toggle loading</LnxButton>
				</div>
			</div>
		</section>
		<section v-if="isShown('confirm')">
			<h2>useConfirm</h2>
			<pre class="state">answers: {{ confirmAnswers.join(', ') }}</pre>
			<div style="display: flex; gap: 12px; flex-wrap: wrap">
				<LnxButton
					:variant="BUTTON_VARIANTS.DANGER"
					@click="askDelete()"
				>
					Delete (danger)
				</LnxButton>
				<LnxButton @click="askPublish()">
					Publish (text only)
				</LnxButton>
				<LnxButton
					:mode="BUTTON_MODES.OUTLINE"
					@click="askThree()"
				>
					Three at once
				</LnxButton>
			</div>
		</section>
		<section v-if="isShown('shortcuts')">
			<h2>useShortcut</h2>
			<p>Press <LnxKbd combo="n" /> for new, <LnxKbd combo="mod+enter" /> to save, <LnxKbd combo="g i" /> to go, <LnxKbd combo="?" /> for the sheet. Esc counts only while editing.</p>
			<div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
				<LnxButton :title="shortcutTitle('Save', 'mod+enter')" @click="shortcutLog.push('save (click)')">
					Save <LnxKbd combo="mod+enter" />
				</LnxButton>
				<LnxButton mode="outline" @click="isEditingShortcut = !isEditingShortcut">
					{{ isEditingShortcut ? 'Editing' : 'Not editing' }}
				</LnxButton>
				<LnxInput v-model="shortcutText" placeholder="Type n here: it's text" />
			</div>
			<pre class="state">log: {{ shortcutLog.join(', ') }}</pre>
			<LnxShortcutsSheet :rows="[{ description: 'Undo the last action', combos: ['mod+z'] }]" />
		</section>
		<section v-if="isShown('toaster')">
			<h2>toast</h2>
			<div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center">
				<LnxButton @click="toastSave()">Save (undo)</LnxButton>
				<LnxButton variant="danger" @click="toast('Could not save: the network is down', { variant: 'danger' })">Danger</LnxButton>
				<LnxButton variant="success" @click="toast('Sent to the 12 members of the board, who will receive it by email in a few minutes', { variant: 'success' })">Success (long)</LnxButton>
				<LnxButton variant="warning" @click="toast('Quota almost full', { variant: 'warning' })">Warning</LnxButton>
				<LnxButton variant="info" @click="toast('Copied', { variant: 'info', duration: 2000 })">Info 2s</LnxButton>
				<LnxButton mode="outline" @click="toast('Fixed: closes only by hand', { duration: Infinity })">Infinity</LnxButton>
				<LnxButton mode="outline" @click="toast('Undo will fail', { undo: failingUndo })">Failing undo</LnxButton>
				<LnxButton mode="outline" @click="[...toasts].forEach(item => dismiss(item.id))">Dismiss all</LnxButton>
			</div>
			<pre class="state">receipts: {{ toastReceipts }}</pre>
		</section>
		<section v-if="isShown('checkbox')">
			<h2>LnxCheckbox</h2>
			<form style="display: grid; gap: 12px; max-width: 360px" @submit.prevent="checkboxSubmitted = true">
				<LnxCheckbox v-model="checkboxBool">Boolean</LnxCheckbox>
				<LnxCheckbox v-model="checkboxAll" :indeterminate="checkboxList.length > 0 && !checkboxAll">All channels</LnxCheckbox>
				<LnxCheckbox v-for="c in ['email', 'sms', 'push']" :key="c" v-model="checkboxList" :value="c" style="margin-left: 26px">{{ c }}</LnxCheckbox>
				<LnxCheckbox v-model="checkboxBool">Send me a summary of the minutes after every meeting of the board, with the agreements and the votes of each member</LnxCheckbox>
				<LnxCheckbox :model-value="true" is-loading>Loading</LnxCheckbox>
				<LnxCheckbox is-loading>Loading empty</LnxCheckbox>
				<LnxCheckbox disabled>Disabled</LnxCheckbox>
				<LnxCheckbox v-model="checkboxTerms" required :has-error="!checkboxTerms" custom-validity="Accept the terms">
					I accept the terms
					<template #helper>Required</template>
				</LnxCheckbox>
				<LnxButton type="submit">Submit</LnxButton>
			</form>
			<pre class="state">bool: {{ checkboxBool }}, list: {{ checkboxList }}, submitted: {{ checkboxSubmitted }}</pre>
		</section>
	</main>
</template>

<style scoped>
.header {
	position: sticky;
	top: 0;
	z-index: 10;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	padding: 8px 16px;
	background-color: var(--lnx-color-bg);
	border-bottom: 1px solid var(--sandbox-border);
}

.nav {
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
}

.main {
	display: flex;
	flex-direction: column;
	gap: 40px;
	padding: 16px 16px 64px;
}

h2 {
	margin: 0 0 12px;
	font-size: 18px;
}

.state {
	margin: 0 0 12px;
	font-size: 12px;
	opacity: .7;
}
</style>
