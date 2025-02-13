<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<svg viewBox="0 0 21 7">
		<rect
			v-for="record in activity" :x="record.x"
			:y="record.date.weekday" class="day"
			fill="transparent" height="1"
			rx="1" ry="1"
			width="1"
		>
			<title>{{ record.date.year }}/{{ record.date.month + 1 }}/{{ record.date.day }}</title>
		</rect>
		<rect
			v-for="record in activity" :fill="record.color"
			:height="record.v" :width="record.v"
			:x="record.x + ((1 - record.v) / 2)" :y="record.date.weekday + ((1 - record.v) / 2)"
			class="day" rx="1"
			ry="1"
			style="pointer-events: none;"
		/>
		<rect
			:x="activity[0].x"
			:y="activity[0].date.weekday" class="today"
			fill="none" height="1"
			rx="1" ry="1"
			stroke="#f73520"
			stroke-width="0.1"
			width="1"
		/>
	</svg>
</template>

<script lang="ts" setup>
const props = defineProps<{
	activity: {
		total: number;
		notes: number;
		replies: number;
		renotes: number;
	}[]
}>();

for (const d of props.activity) {
	d.total = d.notes + d.replies + d.renotes;
}
const peak = Math.max(...props.activity.map(d => d.total));

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const day = now.getDate();

let x = 20;
props.activity.slice().forEach((d, i) => {
	d.x = x;

	const date = new Date(year, month, day - i);
	d.date = {
		year: date.getFullYear(),
		month: date.getMonth(),
		day: date.getDate(),
		weekday: date.getDay(),
	};

	d.v = peak === 0 ? 0 : d.total / (peak / 2);
	if (d.v > 1) d.v = 1;
	const ch = d.date.weekday === 0 || d.date.weekday === 6 ? 275 : 170;
	const cs = d.v * 100;
	const cl = 15 + ((1 - d.v) * 80);
	d.color = `hsl(${ch}, ${cs}%, ${cl}%)`;

	if (d.date.weekday === 0) x--;
});
</script>

<style lang="scss" scoped>
svg {
	display: block;
	padding: 16px;
	width: 100%;
	box-sizing: border-box;

	> rect {
		transform-origin: center;

		&.day {
			&:hover {
				fill: rgba(#000, 0.05);
			}
		}
	}
}
</style>
