<!--
SPDX-FileCopyrightText: syuilo and other misskey contributors
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<div
		:class="[$style.cell]"
		:data-grid-cell-col="-1"
		:data-grid-cell-row="row?.index ?? -1"
		:tabindex="-1"
		class="mk_grid_th"
		data-grid-cell
	>
		<div :class="[$style.root]">
			{{ content }}
		</div>
	</div>
</template>

<script lang="ts" setup>
import type {GridRow} from '@/components/grid/row.js';

defineProps<{
	content: string,
	row?: GridRow,
}>();

</script>

<style lang="scss" module>
$cellHeight: 28px;
$cellWidth: 34px;

.cell {
	overflow: hidden;
	white-space: nowrap;
	height: $cellHeight;
	max-height: $cellHeight;
	min-height: $cellHeight;
	min-width: $cellWidth;
	width: $cellWidth;
	cursor: pointer;
}

.root {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
	padding: 0 8px;
	height: 100%;
	border: solid 0.5px transparent;

	&.selected {
		background-color: var(--MI_THEME-accentedBg);
	}
}
</style>
