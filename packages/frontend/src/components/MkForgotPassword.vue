<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<MkModalWindow
		ref="dialog"
		:height="400"
		:width="370"
		@close="dialog?.close()"
		@closed="emit('closed')"
	>
		<template #header>{{ i18n.ts.forgotPassword }}</template>

		<MkSpacer :marginMax="28" :marginMin="20">
			<form v-if="instance.enableEmail" @submit.prevent="onSubmit">
				<div class="_gaps_m">
					<MkInput v-model="username" :spellcheck="false" autofocus pattern="^[a-zA-Z0-9_]+$" required type="text">
						<template #label>{{ i18n.ts.username }}</template>
						<template #prefix>@</template>
					</MkInput>

					<MkInput v-model="email" :spellcheck="false" required type="email">
						<template #label>{{ i18n.ts.emailAddress }}</template>
						<template #caption>{{ i18n.ts._forgotPassword.enterEmail }}</template>
					</MkInput>

					<MkButton :disabled="processing" primary rounded style="margin: 0 auto;" type="submit">{{ i18n.ts.send }}</MkButton>

					<MkInfo>{{ i18n.ts._forgotPassword.ifNoEmail }}</MkInfo>
				</div>
			</form>
			<div v-else>
				{{ i18n.ts._forgotPassword.contactAdmin }}
			</div>
		</MkSpacer>
	</MkModalWindow>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import MkModalWindow from '@/components/MkModalWindow.vue';
import MkButton from '@/components/MkButton.vue';
import MkInput from '@/components/MkInput.vue';
import MkInfo from '@/components/MkInfo.vue';
import * as os from '@/os.js';
import {instance} from '@/instance.js';
import {i18n} from '@/i18n.js';

const emit = defineEmits<{
	(ev: 'done'): void;
	(ev: 'closed'): void;
}>();

const dialog = ref<InstanceType<typeof MkModalWindow>>();

const username = ref('');
const email = ref('');
const processing = ref(false);

async function onSubmit() {
	processing.value = true;
	await os.apiWithDialog('request-reset-password', {
		username: username.value,
		email: email.value,
	});
	emit('done');
	dialog.value?.close();
}
</script>
