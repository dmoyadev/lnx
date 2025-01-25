<template>
	<div class="demo-container">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.demo-container {
	border: 1px solid var(--lnx-color-gray-5);
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow-x: visible;
	overflow-y: visible;
}
</style>
