<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<MkModalWindow
		ref="dialog"
		:height="650"
		:width="600"
		@close="close(true)"
		@closed="emit('closed')"
	>
		<template v-if="page === 1" #header><i class="ti ti-pencil"></i> {{ i18n.ts._initialTutorial._note.title }}</template>
		<template v-else-if="page === 2" #header><i class="ti ti-mood-smile"></i> {{ i18n.ts._initialTutorial._reaction.title }}</template>
		<template v-else-if="page === 3" #header><i class="ti ti-home"></i> {{ i18n.ts._initialTutorial._timeline.title }}</template>
		<template v-else-if="page === 4" #header><i class="ti ti-pencil-plus"></i> {{ i18n.ts._initialTutorial._postNote.title }}</template>
		<template v-else-if="page === 5" #header><i class="ti ti-eye-exclamation"></i> {{ i18n.ts._initialTutorial._howToMakeAttachmentsSensitive.title }}</template>
		<template v-else #header>{{ i18n.ts._initialTutorial.title }}</template>

		<div style="overflow-x: clip;">
			<Transition
				:enterActiveClass="$style.transition_x_enterActive"
				:enterFromClass="$style.transition_x_enterFrom"
				:leaveActiveClass="$style.transition_x_leaveActive"
				:leaveToClass="$style.transition_x_leaveTo"
				mode="out-in"
			>
				<template v-if="page === 0">
					<div :class="$style.centerPage">
						<MkAnimBg :scale="1.5" style="position: absolute; top: 0;"/>
						<MkSpacer :marginMax="28" :marginMin="20">
							<div class="_gaps" style="text-align: center;">
								<i class="ti ti-confetti" style="display: block; margin: auto; font-size: 3em; color: var(--MI_THEME-accent);"></i>
								<div style="font-size: 120%;">{{ i18n.ts._initialTutorial._landing.title }}</div>
								<div>{{ i18n.ts._initialTutorial._landing.description }}</div>
								<MkButton gradate primary rounded style="margin: 16px auto 0 auto;" @click="page++">{{ i18n.ts._initialTutorial.launchTutorial }} <i class="ti ti-arrow-right"></i></MkButton>
								<MkButton rounded style="margin: 0 auto;" transparent @click="close(true)">{{ i18n.ts.close }}</MkButton>
							</div>
						</MkSpacer>
					</div>
				</template>
				<template v-else-if="page === 1">
					<div style="height: 100cqh; overflow: auto;">
						<div :class="$style.pageRoot">
							<MkSpacer :class="$style.pageMain" :marginMax="28" :marginMin="20">
								<XNote phase="aboutNote"/>
							</MkSpacer>
							<div :class="$style.pageFooter">
								<div class="_buttonsCenter">
									<MkButton v-if="initialPage !== 1" rounded @click="page--"><i class="ti ti-arrow-left"></i> {{ i18n.ts.goBack }}</MkButton>
									<MkButton gradate primary rounded @click="page++">{{ i18n.ts.continue }} <i class="ti ti-arrow-right"></i></MkButton>
								</div>
							</div>
						</div>
					</div>
				</template>
				<template v-else-if="page === 2">
					<div style="height: 100cqh; overflow: auto;">
						<div :class="$style.pageRoot">
							<MkSpacer :class="$style.pageMain" :marginMax="28" :marginMin="20">
								<div class="_gaps">
									<XNote phase="howToReact" @reacted="isReactionTutorialPushed = true"/>
									<div v-if="!isReactionTutorialPushed">{{ i18n.ts._initialTutorial._reaction.reactToContinue }}</div>
								</div>
							</MkSpacer>
							<div :class="$style.pageFooter">
								<div class="_buttonsCenter">
									<MkButton v-if="initialPage !== 2" rounded @click="page--"><i class="ti ti-arrow-left"></i> {{ i18n.ts.goBack }}</MkButton>
									<MkButton :disabled="!isReactionTutorialPushed" gradate primary rounded @click="page++">{{ i18n.ts.continue }} <i class="ti ti-arrow-right"></i></MkButton>
								</div>
							</div>
						</div>
					</div>
				</template>
				<template v-else-if="page === 3">
					<div style="height: 100cqh; overflow: auto;">
						<div :class="$style.pageRoot">
							<MkSpacer :class="$style.pageMain" :marginMax="28" :marginMin="20">
								<XTimeline/>
							</MkSpacer>
							<div :class="$style.pageFooter">
								<div class="_buttonsCenter">
									<MkButton v-if="initialPage !== 3" rounded @click="page--"><i class="ti ti-arrow-left"></i> {{ i18n.ts.goBack }}</MkButton>
									<MkButton gradate primary rounded @click="page++">{{ i18n.ts.continue }} <i class="ti ti-arrow-right"></i></MkButton>
								</div>
							</div>
						</div>
					</div>
				</template>
				<template v-else-if="page === 4">
					<div style="height: 100cqh; overflow: auto;">
						<div :class="$style.pageRoot">
							<MkSpacer :class="$style.pageMain" :marginMax="28" :marginMin="20">
								<XPostNote/>
							</MkSpacer>
							<div :class="$style.pageFooter">
								<div class="_buttonsCenter">
									<MkButton v-if="initialPage !== 3" rounded @click="page--"><i class="ti ti-arrow-left"></i> {{ i18n.ts.goBack }}</MkButton>
									<MkButton gradate primary rounded @click="page++">{{ i18n.ts.continue }} <i class="ti ti-arrow-right"></i></MkButton>
								</div>
							</div>
						</div>
					</div>
				</template>
				<template v-else-if="page === 5">
					<div style="height: 100cqh; overflow: auto;">
						<div :class="$style.pageRoot">
							<MkSpacer :class="$style.pageMain" :marginMax="28" :marginMin="20">
								<div class="_gaps">
									<XSensitive @succeeded="isSensitiveTutorialSucceeded = true"/>
									<div v-if="!isSensitiveTutorialSucceeded">{{ i18n.ts._initialTutorial._howToMakeAttachmentsSensitive.doItToContinue }}</div>
								</div>
							</MkSpacer>
							<div :class="$style.pageFooter">
								<div class="_buttonsCenter">
									<MkButton v-if="initialPage !== 2" rounded @click="page--"><i class="ti ti-arrow-left"></i> {{ i18n.ts.goBack }}</MkButton>
									<MkButton :disabled="!isSensitiveTutorialSucceeded" gradate primary rounded @click="page++">{{ i18n.ts.continue }} <i class="ti ti-arrow-right"></i></MkButton>
								</div>
							</div>
						</div>
					</div>
				</template>
				<template v-else-if="page === 6">
					<div :class="$style.centerPage">
						<MkAnimBg :scale="1.5" style="position: absolute; top: 0;"/>
						<MkSpacer :marginMax="28" :marginMin="20">
							<div class="_gaps" style="text-align: center;">
								<i class="ti ti-check" style="display: block; margin: auto; font-size: 3em; color: var(--MI_THEME-accent);"></i>
								<div style="font-size: 120%;">{{ i18n.ts._initialTutorial._done.title }}</div>
								<I18n :src="i18n.ts._initialTutorial._done.description" style="padding: 0 16px;" tag="div">
									<template #link>
										<a class="_link" href="https://misskey-hub.net/docs/for-users/" target="_blank">{{ i18n.ts.help }}</a>
									</template>
								</I18n>
								<div>{{ i18n.tsx._initialAccountSetting.haveFun({name: instance.name ?? host}) }}</div>
								<div class="_buttonsCenter" style="margin-top: 16px;">
									<MkButton v-if="initialPage !== 4" rounded @click="page--"><i class="ti ti-arrow-left"></i> {{ i18n.ts.goBack }}</MkButton>
									<MkButton gradate primary rounded @click="close(false)">{{ i18n.ts.close }}</MkButton>
								</div>
							</div>
						</MkSpacer>
					</div>
				</template>
			</Transition>
		</div>
	</MkModalWindow>
</template>

<script lang="ts" setup>
import {ref, shallowRef, watch} from 'vue';
import MkModalWindow from '@/components/MkModalWindow.vue';
import MkButton from '@/components/MkButton.vue';
import XNote from '@/components/MkTutorialDialog.Note.vue';
import XTimeline from '@/components/MkTutorialDialog.Timeline.vue';
import XPostNote from '@/components/MkTutorialDialog.PostNote.vue';
import XSensitive from '@/components/MkTutorialDialog.Sensitive.vue';
import MkAnimBg from '@/components/MkAnimBg.vue';
import {i18n} from '@/i18n.js';
import {instance} from '@/instance.js';
import {host} from '@@/js/config.js';
import {claimAchievement} from '@/scripts/achievements.js';
import * as os from '@/os.js';

const props = defineProps<{
	initialPage?: number;
}>();

const emit = defineEmits<{
	(ev: 'closed'): void;
}>();

const dialog = shallowRef<InstanceType<typeof MkModalWindow>>();

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const page = ref(props.initialPage ?? 0);

watch(page, (to) => {
	// チュートリアルの枚数を増やしたら必ず変更すること！！
	if (to === 6) {
		claimAchievement('tutorialCompleted');
	}
});

const isReactionTutorialPushed = ref<boolean>(false);
const isSensitiveTutorialSucceeded = ref<boolean>(false);

async function close(skip: boolean) {
	if (skip) {
		const {canceled} = await os.confirm({
			type: 'warning',
			text: i18n.ts._initialTutorial.skipAreYouSure,
		});
		if (canceled) return;
	}

	dialog.value?.close();
}
</script>

<style lang="scss" module>
.transition_x_enterActive,
.transition_x_leaveActive {
	transition: opacity 0.3s cubic-bezier(0, 0, .35, 1), transform 0.3s cubic-bezier(0, 0, .35, 1);
}

.transition_x_enterFrom {
	opacity: 0;
	transform: translateX(50px);
}

.transition_x_leaveTo {
	opacity: 0;
	transform: translateX(-50px);
}

.progressBar {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 10;
	width: 100%;
	height: 4px;
}

.progressBarValue {
	height: 100%;
	background: linear-gradient(90deg, var(--MI_THEME-buttonGradateA), var(--MI_THEME-buttonGradateB));
	transition: all 0.5s cubic-bezier(0, .5, .5, 1);
}

.centerPage {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100cqh;
	padding-bottom: 30px;
	box-sizing: border-box;
}

.pageRoot {
	display: flex;
	flex-direction: column;
	min-height: 100%;
}

.pageMain {
	flex-grow: 1;
	line-height: 1.5;
}

.pageFooter {
	position: sticky;
	bottom: 0;
	left: 0;
	flex-shrink: 0;
	padding: 12px;
	border-top: solid 0.5px var(--MI_THEME-divider);
	-webkit-backdrop-filter: blur(15px);
	backdrop-filter: blur(15px);
}
</style>
