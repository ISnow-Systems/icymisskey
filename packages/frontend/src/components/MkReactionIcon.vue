<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<MkCustomEmoji v-if="reaction[0] === ':'" ref="elRef" :fallbackToImage="true" :name="reaction" :noStyle="noStyle" :normal="true" :url="emojiUrl"/>
	<MkEmoji v-else ref="elRef" :emoji="reaction" :noStyle="noStyle" :normal="true"/>
</template>

<script lang="ts" setup>
import {defineAsyncComponent, shallowRef} from 'vue';
import {useTooltip} from '@/scripts/use-tooltip.js';
import * as os from '@/os.js';

const props = defineProps<{
	reaction: string;
	noStyle?: boolean;
	emojiUrl?: string;
	withTooltip?: boolean;
}>();

const elRef = shallowRef();

if (props.withTooltip) {
	useTooltip(elRef, (showing) => {
		const {dispose} = os.popup(defineAsyncComponent(() => import('@/components/MkReactionTooltip.vue')), {
			showing,
			reaction: props.reaction.replace(/^:(\w+):$/, ':$1@.:'),
			targetElement: elRef.value.$el,
		}, {
			closed: () => dispose(),
		});
	});
}
</script>
