<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<svg :class="$style.root" preserveAspectRatio="none" viewBox="0 0 1 1">
		<circle
			:class="$style.circle"
			:r="r" cx="50%"
			cy="50%"
			fill="none"
			stroke="rgba(0, 0, 0, 0.05)"
			stroke-width="0.1"
		/>
		<circle
			:class="$style.circle"
			:r="r" :stroke="color"
			:stroke-dasharray="Math.PI * (r * 2)"
			:stroke-dashoffset="strokeDashoffset"
			cx="50%"
			cy="50%"
			fill="none"
			stroke-width="0.1"
		/>
		<text :class="$style.text" dy="0.05" text-anchor="middle" x="50%" y="50%">{{ (value * 100).toFixed(0) }}%</text>
	</svg>
</template>

<script lang="ts" setup>
import {computed} from 'vue';

const props = defineProps<{
	value: number;
}>();

const r = 0.45;

const color = computed(() => `hsl(${180 - (props.value * 180)}, 80%, 70%)`);
const strokeDashoffset = computed(() => (1 - props.value) * (Math.PI * (r * 2)));
</script>

<style lang="scss" module>
.root {
	display: block;
	height: 100%;
}

.circle {
	transform-origin: center;
	transform: rotate(-90deg);
	transition: stroke-dashoffset 0.5s ease;
}

.text {
	font-size: 0.15px;
	fill: currentColor;
}
</style>
