<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<!-- 動的ページのブロックの代替。利用できないということを表示する -->
<template>
	<div :class="$style.root">
		<div :class="$style.heading"><i class="ti ti-dice-5"></i> {{ i18n.ts._pages.blocks.dynamic }}</div>
		<I18n :class="$style.text" :src="i18n.ts._pages.blocks.dynamicDescription" tag="div">
			<template #play>
				<MkA class="_link" to="/play">Play</MkA>
			</template>
		</I18n>
	</div>
</template>

<script lang="ts" setup>
import * as Misskey from 'misskey-js';
import {i18n} from '@/i18n.js';

const props = defineProps<{
	block: Misskey.entities.PageBlock,
	page: Misskey.entities.Page,
}>();
</script>

<style lang="scss" module>
.root {
	border: 1px solid var(--MI_THEME-divider);
	border-radius: var(--MI-radius);
	padding: var(--MI-margin);
	text-align: center;
}

.heading {
	font-weight: 700;
}

.text {
	font-size: 90%;
}
</style>
