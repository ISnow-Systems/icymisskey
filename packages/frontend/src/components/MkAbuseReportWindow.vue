<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<MkWindow ref="uiWindow" :canResize="true" :initialHeight="500" :initialWidth="400" @closed="emit('closed')">
		<template #header>
			<i class="ti ti-exclamation-circle" style="margin-right: 0.5em;"></i>
			<I18n :src="i18n.ts.reportAbuseOf" tag="span">
				<template #name>
					<b>
						<MkAcct :user="user"/>
					</b>
				</template>
			</I18n>
		</template>
		<MkSpacer :marginMax="28" :marginMin="20">
			<div :class="$style.root" class="_gaps_m">
				<div class="">
					<MkTextarea v-model="comment">
						<template #label>{{ i18n.ts.details }}</template>
						<template #caption>{{ i18n.ts.fillAbuseReportDescription }}</template>
					</MkTextarea>
				</div>
				<div class="">
					<MkButton :disabled="comment.length === 0" full primary @click="send">{{ i18n.ts.send }}</MkButton>
				</div>
			</div>
		</MkSpacer>
	</MkWindow>
</template>

<script lang="ts" setup>
import {ref, shallowRef} from 'vue';
import * as Misskey from 'misskey-js';
import MkWindow from '@/components/MkWindow.vue';
import MkTextarea from '@/components/MkTextarea.vue';
import MkButton from '@/components/MkButton.vue';
import * as os from '@/os.js';
import {i18n} from '@/i18n.js';

const props = defineProps<{
	user: Misskey.entities.UserLite;
	initialComment?: string;
}>();

const emit = defineEmits<{
	(ev: 'closed'): void;
}>();

const uiWindow = shallowRef<InstanceType<typeof MkWindow>>();
const comment = ref(props.initialComment ?? '');

function send() {
	os.apiWithDialog('users/report-abuse', {
		userId: props.user.id,
		comment: comment.value,
	}, undefined).then(res => {
		os.alert({
			type: 'success',
			text: i18n.ts.abuseReported,
		});
		uiWindow.value?.close();
		emit('closed');
	});
}
</script>

<style lang="scss" module>
.root {
	--root-margin: 16px;
}
</style>
