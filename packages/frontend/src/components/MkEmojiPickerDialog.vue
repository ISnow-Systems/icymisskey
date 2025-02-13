<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<MkModal
		ref="modal"
		v-slot="{ type, maxHeight }"
		:hasInteractionWithOtherFocusTrappedEls="true"
		:manualShowing="manualShowing"
		:preferType="defaultStore.state.emojiPickerStyle"
		:src="src"
		:transparentBg="true"
		:zPriority="'middle'"
		@click="modal?.close()"
		@close="emit('close')"
		@closed="emit('closed')"
		@esc="modal?.close()"
		@opening="opening"
	>
		<MkEmojiPicker
			ref="picker"
			:asDrawer="type === 'drawer'"
			:asReactionPicker="asReactionPicker"
			:class="{ [$style.drawer]: type === 'drawer' }"
			:max-height="maxHeight"
			:pinnedEmojis="pinnedEmojis"
			:showPinned="showPinned"
			:targetNote="targetNote"
			class="_popup _shadow"
			@chosen="chosen"
			@esc="modal?.close()"
		/>
	</MkModal>
</template>

<script lang="ts" setup>
import * as Misskey from 'misskey-js';
import {shallowRef} from 'vue';
import MkModal from '@/components/MkModal.vue';
import MkEmojiPicker from '@/components/MkEmojiPicker.vue';
import {defaultStore} from '@/store.js';

const props = withDefaults(defineProps<{
	manualShowing?: boolean | null;
	src?: HTMLElement;
	showPinned?: boolean;
	pinnedEmojis?: string[],
	asReactionPicker?: boolean;
	targetNote?: Misskey.entities.Note;
	choseAndClose?: boolean;
}>(), {
	manualShowing: null,
	showPinned: true,
	pinnedEmojis: undefined,
	asReactionPicker: false,
	choseAndClose: true,
});

const emit = defineEmits<{
	(ev: 'done', v: string): void;
	(ev: 'close'): void;
	(ev: 'closed'): void;
}>();

const modal = shallowRef<InstanceType<typeof MkModal>>();
const picker = shallowRef<InstanceType<typeof MkEmojiPicker>>();

function chosen(emoji: string) {
	emit('done', emoji);
	if (props.choseAndClose) {
		modal.value?.close();
	}
}

function opening() {
	picker.value?.reset();
	picker.value?.focus();

	// 何故かちょっと待たないとフォーカスされない
	setTimeout(() => {
		picker.value?.focus();
	}, 10);
}
</script>

<style lang="scss" module>
.drawer {
	border-radius: 24px;
	border-bottom-right-radius: 0;
	border-bottom-left-radius: 0;
}
</style>
