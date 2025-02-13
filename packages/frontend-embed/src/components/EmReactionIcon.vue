<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<EmCustomEmoji v-if="reaction[0] === ':'" ref="elRef" :fallbackToImage="true" :name="reaction" :noStyle="noStyle" :normal="true" :url="emojiUrl"/>
	<EmEmoji v-else ref="elRef" :emoji="reaction" :noStyle="noStyle" :normal="true"/>
</template>

<script lang="ts" setup>
import {} from 'vue';
import EmCustomEmoji from './EmCustomEmoji.vue';
import EmEmoji from './EmEmoji.vue';

const props = defineProps<{
	reaction: string;
	noStyle?: boolean;
	emojiUrl?: string;
	withTooltip?: boolean;
}>();

</script>
