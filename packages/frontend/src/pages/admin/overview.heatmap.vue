<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<div :class="$style.root" class="_panel">
		<MkSelect v-model="src" small style="margin: 0 0 12px 0;">
			<option value="active-users">Active users</option>
			<option value="notes">Notes</option>
			<option value="ap-requests-inbox-received">AP Requests: inboxReceived</option>
			<option value="ap-requests-deliver-succeeded">AP Requests: deliverSucceeded</option>
			<option value="ap-requests-deliver-failed">AP Requests: deliverFailed</option>
		</MkSelect>
		<MkHeatmap :src="src"/>
	</div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import MkHeatmap from '@/components/MkHeatmap.vue';
import MkSelect from '@/components/MkSelect.vue';

const src = ref('active-users');
</script>

<style lang="scss" module>
.root {
	padding: 20px;
}
</style>
