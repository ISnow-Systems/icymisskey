<!--
SPDX-FileCopyrightText: syuilo and other misskey contributors
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<div
		:class="$style.root"
		:data-grid-row="-1"
		class="mk_grid_tr"
	>
		<MkNumberCell
			v-if="gridSetting.showNumber"
			:top="true"
			content="#"
		/>
		<MkHeaderCell
			v-for="column in columns"
			:key="column.index"
			:bus="bus"
			:column="column"
			@operation:beginWidthChange="(sender) => emit('operation:beginWidthChange', sender)"
			@operation:endWidthChange="(sender) => emit('operation:endWidthChange', sender)"
			@operation:widthLargest="(sender) => emit('operation:widthLargest', sender)"
			@change:width="(sender, width) => emit('change:width', sender, width)"
			@change:contentSize="(sender, newSize) => emit('change:contentSize', sender, newSize)"
		/>
	</div>
</template>

<script lang="ts" setup>
import {GridEventEmitter} from '@/components/grid/grid.js';
import MkHeaderCell from '@/components/grid/MkHeaderCell.vue';
import MkNumberCell from '@/components/grid/MkNumberCell.vue';
import type {Size} from '@/components/grid/grid.js';
import type {GridColumn} from '@/components/grid/column.js';
import type {GridRowSetting} from '@/components/grid/row.js';

const emit = defineEmits<{
	(ev: 'operation:beginWidthChange', sender: GridColumn): void;
	(ev: 'operation:endWidthChange', sender: GridColumn): void;
	(ev: 'operation:widthLargest', sender: GridColumn): void;
	(ev: 'operation:selectionColumn', sender: GridColumn): void;
	(ev: 'change:width', sender: GridColumn, width: string): void;
	(ev: 'change:contentSize', sender: GridColumn, newSize: Size): void;
}>();

defineProps<{
	columns: GridColumn[],
	gridSetting: GridRowSetting,
	bus: GridEventEmitter,
}>();
</script>

<style lang="scss" module>
.root {
	display: flex;
	flex-direction: row;
	align-items: center;
}
</style>
