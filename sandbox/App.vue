<script setup lang="ts">
import { ButtonVariants, LnxButton } from 'lnxjs-components/src';
</script>

<template>
	<LnxButton
		:variant="ButtonVariants.DANGER"
		href="/hola"
		is-block
	>
		Test
	</LnxButton>
</template>
