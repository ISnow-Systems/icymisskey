<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<div :class="$style.root" class="_panel">
		<MkRetentionHeatmap/>
	</div>
</template>

<script lang="ts" setup>
import MkRetentionHeatmap from '@/components/MkRetentionHeatmap.vue';
</script>

<style lang="scss" module>
.root {
	padding: 20px;
}
</style>
