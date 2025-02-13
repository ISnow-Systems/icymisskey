<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<MkModalWindow
		ref="dialog"
		:height="450"
		:okButtonDisabled="false"
		:width="400"
		:withOkButton="true"
		@close="dialog?.close()"
		@closed="emit('closed')"
		@ok="ok()"
	>
		<template #header>{{ i18n.ts.describeFile }}</template>
		<MkSpacer :marginMax="28" :marginMin="20">
			<MkDriveFileThumbnail :file="file" fit="contain" style="height: 100px; margin-bottom: 16px;"/>
			<MkTextarea v-model="caption" :placeholder="i18n.ts.inputNewDescription" autofocus>
				<template #label>{{ i18n.ts.caption }}</template>
			</MkTextarea>
		</MkSpacer>
	</MkModalWindow>
</template>

<script lang="ts" setup>
import {shallowRef, ref} from 'vue';
import * as Misskey from 'misskey-js';
import MkModalWindow from '@/components/MkModalWindow.vue';
import MkTextarea from '@/components/MkTextarea.vue';
import MkDriveFileThumbnail from '@/components/MkDriveFileThumbnail.vue';
import {i18n} from '@/i18n.js';

const props = defineProps<{
	file: Misskey.entities.DriveFile;
	default: string;
}>();

const emit = defineEmits<{
	(ev: 'done', v: string): void;
	(ev: 'closed'): void;
}>();

const dialog = shallowRef<InstanceType<typeof MkModalWindow>>();

const caption = ref(props.default);

async function ok() {
	emit('done', caption.value);
	dialog.value?.close();
}
</script>
