<script setup lang="ts">
import { ComponentEvent, EmittedEvent } from './types';

defineProps<{
	events: Record<string, ComponentEvent>;
	emitted: EmittedEvent[];
}>();
</script>

<template>
	<div
		v-for="(event, name) in events"
		:key="name"
		class="event"
	>
		<div class="event-data">
			<span class="name">
				{{ name }}
				<code
					v-if="event.type"
					class="type"
				>
					<a
						v-if="typeof event.type === 'string'"
						:href="`#${event.type.toLowerCase()}`"
					>
						{{ event.type }}
					</a>
					<a
						v-else
						:href="event.type.link"
						target="_blank"
					>
						{{ event.type.name }}
					</a>
				</code>
			</span>

			<span>{{ event.description }}</span>

			<span
				v-if="event.isNative"
				class="native"
			>
				Native HTML event
			</span>
		</div>

		<div
			v-if="Object.entries(emitted).filter(([_, e]) => e.name === name).length"
			class="event-emitted"
		>
			<div
				v-for="emittedEvent in Object.entries(emitted).filter(([_, e]) => e.name === name).reverse()"
				:key="emittedEvent[1].timestamp.getMilliseconds()"
				class="emitted"
			>
				{{ emittedEvent[1].timestamp.toLocaleTimeString() }} -&nbsp;
				<pre>{{ emittedEvent[1].data }}</pre>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.event {
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
		color: var(--lnx-color-primary);
	}

	.event-data {
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

			.type {
				font-size: 12px;
				font-weight: normal;
				padding: 4px;
			}
		}

		.native {
			font-size: var(--lnx-font-size-legal);
			font-weight: normal;
			color: var(--vp-c-text-2);
		}
	}

	.event-emitted {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		width: 250px;
		max-height: 96px;
		overflow: auto;
		padding: 4px 8px;
		border: 1px solid var(--vp-code-bg);
		border-radius: 4px;
		background: var(--vp-code-bg);

		.emitted {
			font-family: var(--lnx-font-family-mono), monospace;
			font-size: var(--lnx-font-size-legal);
			white-space: nowrap;
			display: flex;

			pre {
				padding: 0;
			}
		}
	}
}
</style>