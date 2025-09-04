<script setup lang="ts">
import { ref } from 'vue';
import {
	LnxButton,
	ButtonVariants,
	ButtonModes,
	ButtonSizes,
	LnxInput,
} from 'lnxjs-components/src';
import { LnxInputOTP } from 'lnxjs-components/src/input-otp';

const show = ref('input-otp');
const inputModel = ref('');
const inputOTPModel = ref<string>('');

const booleanVariants = [true, false];

function toggleDarkMode() {
	document.documentElement.classList.toggle('dark');
}
</script>

<template>
	<LnxButton
		:mode="ButtonModes.OUTLINE"
		@click="toggleDarkMode"
	>
		🌚
	</LnxButton>

	<LnxButton
		class="btn-toggle"
		@click="show === 'button' ? show = '' : show = 'button'"
	>
		LnxButton
	</LnxButton>

	<LnxButton
		class="btn-toggle"
		@click="show === 'input' ? show = '' : show = 'input'"
	>
		LnxInput
	</LnxButton>

	<LnxButton
		class="btn-toggle"
		@click="show === 'input-otp' ? show = '' : show = 'input-otp'"
	>
		LnxInputOTP
	</LnxButton>

	<template v-if="show === 'button'">
		<div
			v-for="v in ButtonVariants"
			:key="v"
			class="variant-container"
		>
			<span class="variant">{{ v }}</span>
			<div
				v-for="m in ButtonModes"
				:key="m"
				class="variant-container"
			>
				<span class="variant">{{ m }}</span>
				<template
					v-for="s in ButtonSizes"
					:key="s"
				>
					<LnxButton
						:variant="v"
						:mode="m"
						:size="s"
					>
						normal
					</LnxButton>
					<LnxButton
						:variant="v"
						:mode="m"
						:size="s"
						disabled
					>
						disabled
					</LnxButton>
				</template>
			</div>
		</div>
	</template>

	<template v-if="show === 'input'">
		<form>
			<div
				v-for="t in ['text', 'number', 'password']"
				:key="t"
				class="variant-container"
			>
				<span class="variant">{{ t }}</span>
				<div
					v-for="isLoading in booleanVariants"
					:key="String(isLoading)"
					class="variant-container"
				>
					<span class="variant">{{ !isLoading ? 'Loading' : 'Not loading' }}</span>
					<div
						v-for="hasError in booleanVariants"
						:key="String(hasError)"
						class="variant-container"
					>
						<span class="variant">{{ !hasError ? 'Has Error' : 'No error' }}</span>
						<LnxInput
							v-model="inputModel"
							:type="t"
							:is-loading="!isLoading"
							:has-error="!hasError"
							placeholder="placeholder"
						>
							This is the label

							<template #helper>
								This is a helper
							</template>

							<template #error>
								This is an error
							</template>
						</LnxInput>
					</div>
				</div>
			</div>
		</form>
	</template>

	<template v-if="show === 'input-otp'">
		<form>
			<div
				v-for="hasError in booleanVariants"
				:key="String(hasError)"
				class="variant-container"
			>
				<span class="variant">{{ !hasError ? 'Has Error' : 'No error' }}</span>
				<LnxInputOTP
					v-model="inputOTPModel"
					:has-error="!hasError"
				>
					Introduce the code

					<template #helper>
						This is a helper
					</template>

					<template #error>
						This is an error
					</template>
				</LnxInputOTP>
			</div>
		</form>
	</template>
</template>

<style scoped>
:global(html.dark) {
	background-color: var(--lnx-color-bg);
	color: var(--lnx-color-text);
}

:global(body) {
	margin: 8px 16px;
}

.btn-toggle {
	margin: 8px;
}

.variant-container {
	margin: 12px 0;
	padding: 12px 4px 4px;
	border: 1px solid var(--lnx-color-text);
	display: flex;
	align-items: flex-start;
	flex-wrap: wrap;
	gap: 4px;
	position: relative;

	.variant {
		padding: 2px 4px;
		background: var(--lnx-color-bg);
		position: absolute;
		left: 4px;
		top: -10px;
		text-transform: uppercase;
		font-size: 12px;
	}
}
</style>