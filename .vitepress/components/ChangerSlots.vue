<script setup lang="ts">
import { ComponentSlot } from './types';

defineProps<{ slots: Record<string, ComponentSlot> }>();
defineModel<string>('showcasedProp', { default: '' });
</script>

<template>
	<div
		v-for="(slot, name) in slots"
		:key="name"
		class="slot"
	>
		<div class="slot-data">
			<span class="name">{{ name }}</span>
			<span>{{ slot.description }}</span>
			<div
				v-if="!!slot.scopes?.length"
				class="scopes"
			>
				{&nbsp;
				<span
					v-for="(s, index) in slot.scopes"
					:key="index"
					class="scope"
				>
					{{ s.name }}:&nbsp;
					<code>
						<a :href="`#${s.type.toLowerCase()}`">{{ s.type }}</a>
					</code>
					<template v-if="index + 1 !== slot.scopes.length">;&nbsp;</template>
				</span>
				&nbsp;}
			</div>
		</div>

		<div
			v-if="slot.value !== undefined"
			class="slot-value"
		>
			<textarea
				:value="slot.value"
				@input="slot.value = ($event.target as HTMLTextAreaElement).value"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
.slot {
	display: flex;
	align-items: flex-start;
	gap: 20px;
	padding: 10px;

	&:not(:last-child) {
		border-bottom: 1px solid var(--vp-code-bg);
	}

	code {
		display: inline;
		min-width: 0;
		line-height: 1;
		padding: 4px;
		color: var(--lnx-color-primary);
	}

	.slot-data {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		font-size: var(--lnx-font-size-small);

		.name {
			display: flex;
			align-items: center;
			gap: 4px;
			font-weight: bold;
			font-family: var(--lnx-font-family-mono), monospace;
		}

		.scopes {
			display: flex;
			flex-wrap: wrap;
			font-family: var(--lnx-font-family-mono), monospace;
			font-size: var(--lnx-font-size-legal);
			color: var(--vp-c-text-2);

			.scope {
				display: flex;
				align-items: center;

				code {
					font-size: var(--lnx-font-size-legal);
				}
			}
		}
	}

	.slot-value {
		flex-shrink: 0;

		textarea {
			padding: 4px 8px;
			border: 1px solid var(--vp-code-bg);
			border-radius: 4px;
			min-width: 250px;
			min-height: 70px;

			&:focus {
				outline: 4px auto -webkit-focus-ring-color;
			}
		}
	}
}
</style>