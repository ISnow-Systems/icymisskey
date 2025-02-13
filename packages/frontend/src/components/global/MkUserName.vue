<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<Mfm :author="user" :emojiUrls="user.emojis" :nowrap="nowrap" :plain="true" :text="user.name ?? user.username"/>
</template>

<script lang="ts" setup>
import {} from 'vue';
import * as Misskey from 'misskey-js';

const props = withDefaults(defineProps<{
	user: Misskey.entities.User;
	nowrap?: boolean;
}>(), {
	nowrap: true,
});
</script>
