<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<img :alt="props.emoji" :class="$style.root" :src="url" decoding="async"/>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {char2twemojiFilePath} from '@@/js/emoji-base.js';

const props = defineProps<{
	emoji: string;
}>();

const url = computed(() => char2twemojiFilePath(props.emoji));
</script>

<style lang="scss" module>
.root {
	height: 1.25em;
	vertical-align: -0.25em;
}
</style>
