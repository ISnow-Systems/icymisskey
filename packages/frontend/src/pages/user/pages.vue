<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<MkSpacer :contentMax="700">
		<MkPagination ref="list" v-slot="{items}" :pagination="pagination">
			<MkPagePreview v-for="page in items" :key="page.id" :page="page" class="_margin"/>
		</MkPagination>
	</MkSpacer>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import * as Misskey from 'misskey-js';
import MkPagePreview from '@/components/MkPagePreview.vue';
import MkPagination from '@/components/MkPagination.vue';

const props = defineProps<{
	user: Misskey.entities.User;
}>();

const pagination = {
	endpoint: 'users/pages' as const,
	limit: 20,
	params: computed(() => ({
		userId: props.user.id,
	})),
};
</script>
