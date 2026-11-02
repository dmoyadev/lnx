<script setup lang="ts">
import { ref } from 'vue';
import { LnxButton } from '../../packages/components/src/button';
import { LnxInput } from '../../packages/components/src/input';
import { LnxSelect } from '../../packages/components/src/select';
import { LnxInputOTP } from '../../packages/components/src/input-otp';

/* Real components in the hero, so the first thing people see is Lnx itself, in the theme they picked */
const email = ref('');
const plan = ref('Pro');
const code = ref('');
</script>

<template>
	<form
		class="hero-demo"
		aria-label="Live demo of the components"
		@submit.prevent
	>
		<LnxInput
			v-model="email"
			type="email"
			placeholder="ada@example.com"
		>
			Email
		</LnxInput>

		<LnxSelect
			v-model="plan"
			:options="['Free', 'Pro', 'Team']"
		>
			Plan
		</LnxSelect>

		<LnxInputOTP
			v-model="code"
			:length="4"
		>
			Code
		</LnxInputOTP>

		<div class="actions">
			<LnxButton
				mode="clear"
				variant="grayscale"
				type="reset"
			>
				Cancel
			</LnxButton>
			<LnxButton type="submit">
				Subscribe
			</LnxButton>
		</div>
	</form>
</template>

<style scoped lang="scss">
.hero-demo {
	display: flex;
	flex-direction: column;
	gap: 16px;
	width: 320px;
	padding: 24px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	background: var(--vp-c-bg-soft);
	box-shadow: var(--lnx-elevation-4);
}

.actions {
	display: flex;
	justify-content: flex-end;
	gap: 8px;
}
</style>
