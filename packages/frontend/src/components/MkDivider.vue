<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<div
		:style="[
		marginTopBottom ? { marginTop: marginTopBottom, marginBottom: marginTopBottom } : {},
		marginLeftRight ? { marginLeft: marginLeftRight, marginRight: marginLeftRight } : {},
		borderStyle ? { borderStyle: borderStyle } : {},
		borderWidth ? { borderWidth: borderWidth } : {},
		borderColor ? { borderColor: borderColor } : {},
	]" class="default"
	/>
</template>

<script lang="ts" setup>
defineProps<{
	marginTopBottom?: string;
	marginLeftRight?: string;
	borderStyle?: string;
	borderWidth?: string;
	borderColor?: string;
}>();
</script>

<style lang="scss" scoped>
.default {
	border-top: solid 0.5px var(--MI_THEME-divider);
}
</style>
