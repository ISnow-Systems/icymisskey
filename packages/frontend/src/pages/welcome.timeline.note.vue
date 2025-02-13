<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<div :key="note.id" :class="$style.note">
		<div :class="$style.content" class="_panel _gaps_s">
			<div v-if="note.cw != null" :class="$style.richcontent">
				<div>
					<Mfm :author="note.user" :text="note.cw"/>
				</div>
				<MkCwButton v-model="showContent" :files="note.files" :poll="note.poll" :renote="note.renote" :text="note.text" style="margin: 4px 0;"/>
				<div v-if="showContent">
					<MkA v-if="note.replyId" :to="`/notes/${note.replyId}`" class="reply"><i class="ti ti-arrow-back-up"></i></MkA>
					<Mfm v-if="note.text" :author="note.user" :text="note.text"/>
					<MkA v-if="note.renoteId" :to="`/notes/${note.renoteId}`" class="rp">RN: ...</MkA>
				</div>
			</div>
			<div v-else ref="noteTextEl" :class="[$style.text, { [$style.collapsed]: shouldCollapse }]">
				<MkA v-if="note.replyId" :to="`/notes/${note.replyId}`" class="reply"><i class="ti ti-arrow-back-up"></i></MkA>
				<Mfm v-if="note.text" :author="note.user" :text="note.text"/>
				<MkA v-if="note.renoteId" :to="`/notes/${note.renoteId}`" class="rp">RN: ...</MkA>
			</div>
			<div v-if="note.files && note.files.length > 0" :class="$style.richcontent">
				<MkMediaList :mediaList="note.files.slice(0, 4)"/>
			</div>
			<div v-if="note.poll">
				<MkPoll :noteId="note.id" :poll="note.poll" :readOnly="true"/>
			</div>
			<div v-if="note.reactionCount > 0" :class="$style.reactions">
				<MkReactionsViewer :maxNumber="16" :note="note"/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import {ref, shallowRef, onUpdated, onMounted} from 'vue';
import * as Misskey from 'misskey-js';
import MkReactionsViewer from '@/components/MkReactionsViewer.vue';
import MkMediaList from '@/components/MkMediaList.vue';
import MkPoll from '@/components/MkPoll.vue';
import MkCwButton from '@/components/MkCwButton.vue';

defineProps<{
	note: Misskey.entities.Note;
}>();

const noteTextEl = shallowRef<HTMLDivElement>();
const shouldCollapse = ref(false);
const showContent = ref(false);

function calcCollapse() {
	if (noteTextEl.value) {
		const height = noteTextEl.value.scrollHeight;
		if (height > 200) {
			shouldCollapse.value = true;
		}
	}
}

onMounted(() => {
	calcCollapse();
});

onUpdated(() => {
	calcCollapse();
});
</script>

<style lang="scss" module>
.note {
	margin-left: auto;
}

.text {
	position: relative;
	max-height: 200px;
	overflow: hidden;

	&.collapsed::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 64px;
		background: linear-gradient(0deg, var(--MI_THEME-panel), color(from var(--MI_THEME-panel) srgb r g b / 0));
	}
}

.content {
	padding: 16px;
	margin: 0 0 0 auto;
	max-width: max-content;
	border-radius: 16px;
}

.reactions {
	box-sizing: border-box;
	margin: 8px -16px -8px;
	padding: 8px 16px 0;
	width: calc(100% + 32px);
	border-top: 1px solid var(--MI_THEME-divider);
}

.richcontent {
	min-width: 250px;
}
</style>
