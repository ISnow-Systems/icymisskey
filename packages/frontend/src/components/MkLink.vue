<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<component
		:is="self ? 'MkA' : 'a'" ref="el" :[attr]="self ? url.substring(local.length) : url" :behavior="props.navigationBehavior" :rel="rel ?? 'nofollow noopener'" :target="target" :title="url"
		class="_link"
		style="word-break: break-all;"
	>
		<slot></slot>
		<i v-if="target === '_blank'" :class="$style.icon" class="ti ti-external-link"></i>
	</component>
</template>

<script lang="ts" setup>
import {defineAsyncComponent, ref} from 'vue';
import {url as local} from '@@/js/config.js';
import {useTooltip} from '@/scripts/use-tooltip.js';
import * as os from '@/os.js';
import {isEnabledUrlPreview} from '@/instance.js';
import type {MkABehavior} from '@/components/global/MkA.vue';

const props = withDefaults(defineProps<{
	url: string;
	rel?: null | string;
	navigationBehavior?: MkABehavior;
}>(), {});

const self = props.url.startsWith(local);
const attr = self ? 'to' : 'href';
const target = self ? null : '_blank';

const el = ref<HTMLElement | { $el: HTMLElement }>();

if (isEnabledUrlPreview.value) {
	useTooltip(el, (showing) => {
		const {dispose} = os.popup(defineAsyncComponent(() => import('@/components/MkUrlPreviewPopup.vue')), {
			showing,
			url: props.url,
			source: el.value instanceof HTMLElement ? el.value : el.value?.$el,
		}, {
			closed: () => dispose(),
		});
	});
}
</script>

<style lang="scss" module>
.icon {
	padding-left: 2px;
	font-size: .9em;
}
</style>
