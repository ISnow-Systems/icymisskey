<!--
SPDX-FileCopyrightText: syuilo and other misskey contributors
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<MkWindow
		ref="uiWindow"
		:canResize="true"
		:initialHeight="500"
		:initialWidth="400"
		@closed="emit('closed')"
	>
		<template #header>
			<i class="ti ti-notes" style="margin-right: 0.5em;"></i> {{ i18n.ts._customEmojisManager._gridCommon.registrationLogs }}
		</template>
		<MkSpacer>
			<XRegisterLogs :logs="logs"/>
		</MkSpacer>
	</MkWindow>
</template>

<script lang="ts" setup>
import MkWindow from '@/components/MkWindow.vue';
import XRegisterLogs from '@/pages/admin/custom-emojis-manager.logs.vue';

import {i18n} from '@/i18n.js';

import type {RequestLogItem} from './custom-emojis-manager.impl.js';

defineProps<{
	logs: RequestLogItem[];
}>();

const emit = defineEmits<{
	(ev: 'closed'): void;
}>();

</script>
