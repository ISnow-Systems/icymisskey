<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<div :class="$style.root" :style="{ zIndex, top: `${y - 64}px`, left: `${x - 64}px` }">
		<svg height="128" viewBox="0 0 128 128" width="128" xmlns="http://www.w3.org/2000/svg">
			<circle cx="64" cy="64" fill="none" style="stroke: var(--MI_THEME-accent);">
				<animate
					attributeName="r"
					begin="0s" calcMode="spline"
					dur="0.5s"
					keySplines="0.165, 0.84, 0.44, 1"
					keyTimes="0; 1"
					repeatCount="1"
					values="4; 32"
				/>
				<animate
					attributeName="stroke-width"
					begin="0s" calcMode="spline"
					dur="0.5s"
					keySplines="0.3, 0.61, 0.355, 1"
					keyTimes="0; 1"
					repeatCount="1"
					values="16; 0"
				/>
			</circle>
			<g fill="none" fill-rule="evenodd">
				<circle v-for="(particle, i) in particles" :key="i" :fill="particle.color" style="stroke: var(--MI_THEME-accent);">
					<animate
						:values="`${particle.size}; 0`"
						attributeName="r" begin="0s"
						calcMode="spline"
						dur="0.8s"
						keySplines="0.165, 0.84, 0.44, 1"
						keyTimes="0; 1"
						repeatCount="1"
					/>
					<animate
						:values="`${particle.xA}; ${particle.xB}`"
						attributeName="cx" begin="0s"
						calcMode="spline"
						dur="0.8s"
						keySplines="0.3, 0.61, 0.355, 1"
						keyTimes="0; 1"
						repeatCount="1"
					/>
					<animate
						:values="`${particle.yA}; ${particle.yB}`"
						attributeName="cy" begin="0s"
						calcMode="spline"
						dur="0.8s"
						keySplines="0.3, 0.61, 0.355, 1"
						keyTimes="0; 1"
						repeatCount="1"
					/>
				</circle>
			</g>
		</svg>
	</div>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue';
import * as os from '@/os.js';

const props = withDefaults(defineProps<{
	x: number;
	y: number;
	particle?: boolean;
}>(), {
	particle: true,
});

const emit = defineEmits<{
	(ev: 'end'): void;
}>();

const particles: {
	size: number;
	xA: number;
	yA: number;
	xB: number;
	yB: number;
	color: string;
}[] = [];
const origin = 64;
const colors = ['#FF1493', '#00FFFF', '#FFE202'];
const zIndex = os.claimZIndex('high');

if (props.particle) {
	for (let i = 0; i < 12; i++) {
		const angle = Math.random() * (Math.PI * 2);
		const pos = Math.random() * 16;
		const velocity = 16 + (Math.random() * 48);
		particles.push({
			size: 4 + (Math.random() * 8),
			xA: origin + (Math.sin(angle) * pos),
			yA: origin + (Math.cos(angle) * pos),
			xB: origin + (Math.sin(angle) * (pos + velocity)),
			yB: origin + (Math.cos(angle) * (pos + velocity)),
			color: colors[Math.floor(Math.random() * colors.length)],
		});
	}
}

onMounted(() => {
	window.setTimeout(() => {
		emit('end');
	}, 1100);
});
</script>

<style lang="scss" module>
.root {
	pointer-events: none;
	position: fixed;
	width: 128px;
	height: 128px;
}
</style>
