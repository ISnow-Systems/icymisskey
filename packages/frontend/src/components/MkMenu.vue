<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<div
		:class="{
		[$style.root]: true,
		[$style.center]: align === 'center',
		[$style.big]: big,
		[$style.asDrawer]: asDrawer,
	}"
		role="menu"
		@focusin.passive.stop="() => {}"
	>
		<div
			ref="itemsEl"
			v-hotkey="keymap"
			:class="$style.menu"
			:style="{
			width: (width && !asDrawer) ? `${width}px` : '',
			maxHeight: maxHeight ? `min(${maxHeight}px, calc(100dvh - 32px))` : 'calc(100dvh - 32px)',
		}"
			class="_popup _shadow"
			tabindex="0"
			@keydown.stop="() => {}"
			@contextmenu.self.prevent="() => {}"
		>
			<template v-for="item in (items2 ?? [])">
				<div v-if="item.type === 'divider'" :class="$style.divider" role="separator" tabindex="-1"></div>
				<span v-else-if="item.type === 'label'" :class="[$style.label, $style.item]" role="menuitem" tabindex="-1">
				<span style="opacity: 0.7;">{{ item.text }}</span>
			</span>
				<span v-else-if="item.type === 'pending'" :class="[$style.pending, $style.item]" role="menuitem" tabindex="0">
				<span><MkEllipsis/></span>
			</span>
				<MkA
					v-else-if="item.type === 'link'"
					:class="['_button', $style.item]"
					:to="item.to"
					role="menuitem"
					tabindex="0"
					@click.passive="close(true)"
					@mouseenter.passive="onItemMouseEnter"
					@mouseleave.passive="onItemMouseLeave"
				>
					<i v-if="item.icon" :class="[$style.icon, item.icon]" class="ti-fw"></i>
					<MkAvatar v-if="item.avatar" :class="$style.avatar" :user="item.avatar"/>
					<div :class="$style.item_content">
						<span :class="$style.item_content_text">{{ item.text }}</span>
						<span v-if="item.indicate" :class="$style.indicator" class="_blink"><i class="_indicatorCircle"></i></span>
					</div>
				</MkA>
				<a
					v-else-if="item.type === 'a'"
					:class="['_button', $style.item]"
					:download="item.download"
					:href="item.href"
					:rel="item.target === '_blank' ? 'noopener noreferrer' : undefined"
					:target="item.target"
					role="menuitem"
					tabindex="0"
					@click.passive="close(true)"
					@mouseenter.passive="onItemMouseEnter"
					@mouseleave.passive="onItemMouseLeave"
				>
					<i v-if="item.icon" :class="[$style.icon, item.icon]" class="ti-fw"></i>
					<div :class="$style.item_content">
						<span :class="$style.item_content_text">{{ item.text }}</span>
						<span v-if="item.indicate" :class="$style.indicator" class="_blink"><i class="_indicatorCircle"></i></span>
					</div>
				</a>
				<button
					v-else-if="item.type === 'user'"
					:class="['_button', $style.item, { [$style.active]: item.active }]"
					role="menuitem"
					tabindex="0"
					@click.prevent="item.active ? close(false) : clicked(item.action, $event)"
					@mouseenter.passive="onItemMouseEnter"
					@mouseleave.passive="onItemMouseLeave"
				>
					<MkAvatar :class="$style.avatar" :user="item.user"/>
					<MkUserName :user="item.user"/>
					<div v-if="item.indicate" :class="$style.item_content">
						<span :class="$style.indicator" class="_blink"><i class="_indicatorCircle"></i></span>
					</div>
				</button>
				<button
					v-else-if="item.type === 'switch'"
					:class="['_button', $style.item]"
					:disabled="unref(item.disabled)"
					role="menuitemcheckbox"
					tabindex="0"
					@click.prevent="switchItem(item)"
					@mouseenter.passive="onItemMouseEnter"
					@mouseleave.passive="onItemMouseLeave"
				>
					<i v-if="item.icon" :class="[$style.icon, item.icon]" class="ti-fw"></i>
					<MkSwitchButton v-else :checked="item.ref" :class="$style.switchButton" :disabled="item.disabled" @toggle="switchItem(item)"/>
					<div :class="$style.item_content">
						<span :class="[$style.item_content_text, { [$style.switchText]: !item.icon }]">{{ item.text }}</span>
						<MkSwitchButton v-if="item.icon" :checked="item.ref" :class="[$style.switchButton, $style.caret]" :disabled="item.disabled" @toggle="switchItem(item)"/>
					</div>
				</button>
				<button
					v-else-if="item.type === 'radio'"
					:class="['_button', $style.item, $style.parent, { [$style.active]: childShowingItem === item }]"
					:disabled="unref(item.disabled)"
					role="menuitem"
					tabindex="0"
					@mouseenter.prevent="preferClick ? null : showRadioOptions(item, $event)"
					@keydown.enter.prevent="preferClick ? null : showRadioOptions(item, $event)"
					@click.prevent="!preferClick ? null : showRadioOptions(item, $event)"
				>
					<i v-if="item.icon" :class="[$style.icon, item.icon]" class="ti-fw" style="pointer-events: none;"></i>
					<div :class="$style.item_content">
						<span :class="$style.item_content_text" style="pointer-events: none;">{{ item.text }}</span>
						<span :class="$style.caret" style="pointer-events: none;"><i class="ti ti-chevron-right ti-fw"></i></span>
					</div>
				</button>
				<button
					v-else-if="item.type === 'radioOption'"
					:class="['_button', $style.item, $style.radio, { [$style.active]: unref(item.active) }]"
					role="menuitemradio"
					tabindex="0"
					@click.prevent="unref(item.active) ? null : clicked(item.action, $event, false)"
					@mouseenter.passive="onItemMouseEnter"
					@mouseleave.passive="onItemMouseLeave"
				>
					<div :class="$style.icon">
						<span :class="[$style.radioIcon, { [$style.radioChecked]: unref(item.active) }]"></span>
					</div>
					<div :class="$style.item_content">
						<span :class="$style.item_content_text">{{ item.text }}</span>
					</div>
				</button>
				<button
					v-else-if="item.type === 'parent'"
					:class="['_button', $style.item, $style.parent, { [$style.active]: childShowingItem === item }]"
					role="menuitem"
					tabindex="0"
					@mouseenter.prevent="preferClick ? null : showChildren(item, $event)"
					@keydown.enter.prevent="preferClick ? null : showChildren(item, $event)"
					@click.prevent="!preferClick ? null : showChildren(item, $event)"
				>
					<i v-if="item.icon" :class="[$style.icon, item.icon]" class="ti-fw" style="pointer-events: none;"></i>
					<div :class="$style.item_content">
						<span :class="$style.item_content_text" style="pointer-events: none;">{{ item.text }}</span>
						<span :class="$style.caret" style="pointer-events: none;"><i class="ti ti-chevron-right ti-fw"></i></span>
					</div>
				</button>
				<button
					v-else :class="['_button', $style.item, { [$style.danger]: item.danger, [$style.active]: unref(item.active) }]"
					role="menuitem"
					tabindex="0"
					@click.prevent="unref(item.active) ? close(false) : clicked(item.action, $event)"
					@mouseenter.passive="onItemMouseEnter"
					@mouseleave.passive="onItemMouseLeave"
				>
					<i v-if="item.icon" :class="[$style.icon, item.icon]" class="ti-fw"></i>
					<MkAvatar v-if="item.avatar" :class="$style.avatar" :user="item.avatar"/>
					<div :class="$style.item_content">
						<span :class="$style.item_content_text">{{ item.text }}</span>
						<span v-if="item.indicate" :class="$style.indicator" class="_blink"><i class="_indicatorCircle"></i></span>
					</div>
				</button>
			</template>
			<span v-if="items2 == null || items2.length === 0" :class="[$style.none, $style.item]" tabindex="-1">
			<span>{{ i18n.ts.none }}</span>
		</span>
		</div>
		<div v-if="childMenu">
			<XChild ref="child" :items="childMenu" :rootElement="itemsEl!" :targetElement="childTarget!" @actioned="childActioned" @closed="closeChild"/>
		</div>
	</div>
</template>

<script lang="ts">
import {computed, defineAsyncComponent, inject, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, unref, watch} from 'vue';
import MkSwitchButton from '@/components/MkSwitch.button.vue';
import type {MenuItem, InnerMenuItem, MenuPending, MenuAction, MenuSwitch, MenuRadio, MenuRadioOption, MenuParent} from '@/types/menu.js';
import * as os from '@/os.js';
import {i18n} from '@/i18n.js';
import {isTouchUsing} from '@/scripts/touch.js';
import type {Keymap} from '@/scripts/hotkey.js';
import {isFocusable} from '@/scripts/focus.js';
import {getNodeOrNull} from '@/scripts/get-dom-node-or-null.js';

const childrenCache = new WeakMap<MenuParent, MenuItem[]>();
</script>

<script lang="ts" setup>
const XChild = defineAsyncComponent(() => import('./MkMenu.child.vue'));

const props = defineProps<{
	items: MenuItem[];
	asDrawer?: boolean;
	align?: 'center' | string;
	width?: number;
	maxHeight?: number;
}>();

const emit = defineEmits<{
	(ev: 'close', actioned?: boolean): void;
	(ev: 'hide'): void;
}>();

const big = isTouchUsing;

const isNestingMenu = inject<boolean>('isNestingMenu', false);

const itemsEl = shallowRef<HTMLElement>();

const items2 = ref<InnerMenuItem[]>();

const child = shallowRef<InstanceType<typeof XChild>>();

const keymap = {
	'up|k|shift+tab': {
		allowRepeat: true,
		callback: () => focusUp(),
	},
	'down|j|tab': {
		allowRepeat: true,
		callback: () => focusDown(),
	},
	'esc': {
		allowRepeat: true,
		callback: () => close(false),
	},
} as const satisfies Keymap;

const childShowingItem = ref<MenuItem | null>();

let preferClick = isTouchUsing || props.asDrawer;

watch(() => props.items, () => {
	const items = [...props.items].filter(item => item !== undefined) as (NonNullable<MenuItem> | MenuPending)[];

	for (let i = 0; i < items.length; i++) {
		const item = items[i];

		if ('then' in item) { // if item is Promise
			items[i] = {type: 'pending'};
			item.then(actualItem => {
				if (items2.value?.[i]) items2.value[i] = actualItem;
			});
		}
	}

	items2.value = items as InnerMenuItem[];
}, {
	immediate: true,
});

const childMenu = ref<MenuItem[] | null>();
const childTarget = shallowRef<HTMLElement | null>();

function closeChild() {
	childMenu.value = null;
	childShowingItem.value = null;
}

function childActioned() {
	closeChild();
	close(true);
}

let childCloseTimer: null | number = null;

function onItemMouseEnter() {
	childCloseTimer = window.setTimeout(() => {
		closeChild();
	}, 300);
}

function onItemMouseLeave() {
	if (childCloseTimer) window.clearTimeout(childCloseTimer);
}

async function showRadioOptions(item: MenuRadio, ev: Event) {
	const children: MenuItem[] = Object.keys(item.options).map<MenuRadioOption>(key => {
		const value = item.options[key];
		return {
			type: 'radioOption',
			text: key,
			action: () => {
				item.ref = value;
			},
			active: computed(() => item.ref === value),
		};
	});

	if (props.asDrawer) {
		os.popupMenu(children, ev.currentTarget ?? ev.target).finally(() => {
			close(false);
		});
		emit('hide');
	} else {
		childTarget.value = (ev.currentTarget ?? ev.target) as HTMLElement;
		childMenu.value = children;
		childShowingItem.value = item;
	}
}

async function showChildren(item: MenuParent, ev: Event) {
	ev.stopPropagation();

	const children: MenuItem[] = await (async () => {
		if (childrenCache.has(item)) {
			return childrenCache.get(item)!;
		} else {
			if (typeof item.children === 'function') {
				return Promise.resolve(item.children());
			} else {
				return item.children;
			}
		}
	})();

	childrenCache.set(item, children);

	if (props.asDrawer) {
		os.popupMenu(children, ev.currentTarget ?? ev.target).finally(() => {
			close(false);
		});
		emit('hide');
	} else {
		childTarget.value = (ev.currentTarget ?? ev.target) as HTMLElement;
		// これでもリアクティビティは保たれる
		childMenu.value = children;
		childShowingItem.value = item;
	}
}

function clicked(fn: MenuAction, ev: MouseEvent, doClose = true) {
	fn(ev);

	if (!doClose) return;
	close(true);
}

function close(actioned = false) {
	disposeHandlers();
	nextTick(() => {
		closeChild();
		emit('close', actioned);
	});
}

function switchItem(item: MenuSwitch & { ref: any }) {
	if (item.disabled !== undefined && (typeof item.disabled === 'boolean' ? item.disabled : item.disabled.value)) return;
	item.ref = !item.ref;
}

function focusUp() {
	if (disposed) return;
	if (!itemsEl.value?.contains(document.activeElement)) return;

	const focusableElements = Array.from(itemsEl.value.children).filter(isFocusable);
	const activeIndex = focusableElements.findIndex(el => el === document.activeElement);
	const targetIndex = (activeIndex !== -1 && activeIndex !== 0) ? (activeIndex - 1) : (focusableElements.length - 1);
	const targetElement = focusableElements.at(targetIndex) ?? itemsEl.value;

	targetElement.focus();
}

function focusDown() {
	if (disposed) return;
	if (!itemsEl.value?.contains(document.activeElement)) return;

	const focusableElements = Array.from(itemsEl.value.children).filter(isFocusable);
	const activeIndex = focusableElements.findIndex(el => el === document.activeElement);
	const targetIndex = (activeIndex !== -1 && activeIndex !== (focusableElements.length - 1)) ? (activeIndex + 1) : 0;
	const targetElement = focusableElements.at(targetIndex) ?? itemsEl.value;

	targetElement.focus();
}

const onGlobalFocusin = (ev: FocusEvent) => {
	if (disposed) return;
	if (itemsEl.value?.parentElement?.contains(getNodeOrNull(ev.target))) return;
	nextTick(() => {
		if (itemsEl.value != null && isFocusable(itemsEl.value)) {
			itemsEl.value.focus({preventScroll: true});
			nextTick(() => focusDown());
		}
	});
};

const onGlobalMousedown = (ev: MouseEvent) => {
	if (disposed) return;
	if (childTarget.value?.contains(getNodeOrNull(ev.target))) return;
	if (child.value?.checkHit(ev)) return;
	closeChild();
};

const setupHandlers = () => {
	if (!isNestingMenu) {
		document.addEventListener('focusin', onGlobalFocusin, {passive: true});
	}
	document.addEventListener('mousedown', onGlobalMousedown, {passive: true});
};

let disposed = false;

const disposeHandlers = () => {
	disposed = true;
	if (!isNestingMenu) {
		document.removeEventListener('focusin', onGlobalFocusin);
	}
	document.removeEventListener('mousedown', onGlobalMousedown);
};

onMounted(() => {
	setupHandlers();

	if (!isNestingMenu) {
		nextTick(() => itemsEl.value?.focus({preventScroll: true}));
	}
});

onBeforeUnmount(() => {
	disposeHandlers();
});
</script>

<style lang="scss" module>
.root {
	&.center {
		> .menu {
			> .item {
				text-align: center;
			}
		}
	}

	&.big:not(.asDrawer) {
		> .menu {
			min-width: 230px;

			> .item {
				padding: 6px 20px;
				font-size: 0.95em;
				line-height: 24px;
			}
		}
	}

	&.asDrawer {
		max-width: 600px;
		margin: auto;

		> .menu {
			padding: 12px 0 max(env(safe-area-inset-bottom, 0px), 12px) 0;
			width: 100%;
			border-radius: 24px;
			border-bottom-right-radius: 0;
			border-bottom-left-radius: 0;

			> .item {
				font-size: 1em;
				padding: 12px 24px;

				&::before {
					width: calc(100% - 24px);
					border-radius: 12px;
				}

				> .icon {
					margin-right: 14px;
					width: 24px;
				}
			}

			> .divider {
				margin: 12px 0;
			}
		}
	}
}

.menu {
	padding: 8px 0;
	box-sizing: border-box;
	max-width: 100vw;
	min-width: 200px;
	overflow: auto;
	overscroll-behavior: contain;

	&:focus-visible {
		outline: none;
	}
}

.item {
	display: flex;
	align-items: center;
	position: relative;
	padding: 5px 16px;
	width: 100%;
	box-sizing: border-box;
	white-space: nowrap;
	font-size: 0.9em;
	line-height: 20px;
	text-align: left;
	overflow: hidden;
	text-overflow: ellipsis;
	text-decoration: none !important;
	color: var(--menuFg, var(--MI_THEME-fg));

	&::before {
		content: "";
		display: block;
		position: absolute;
		z-index: -1;
		top: 0;
		left: 0;
		right: 0;
		margin: auto;
		width: calc(100% - 16px);
		height: 100%;
		border-radius: 6px;
	}

	&:focus-visible {
		outline: none;

		&:not(:hover):not(:active)::before {
			outline: var(--MI_THEME-focus) solid 2px;
			outline-offset: -2px;
		}
	}

	&:not(:disabled) {
		&:hover,
		&:focus-visible:active,
		&:focus-visible.active {
			color: var(--menuHoverFg, var(--MI_THEME-accent));

			&::before {
				background-color: var(--menuHoverBg, var(--MI_THEME-accentedBg));
			}
		}

		&:not(:focus-visible):active,
		&:not(:focus-visible).active {
			color: var(--menuActiveFg, var(--MI_THEME-fgOnAccent));

			&::before {
				background-color: var(--menuActiveBg, var(--MI_THEME-accent));
			}
		}
	}

	&:disabled {
		cursor: not-allowed;
	}

	&.danger {
		--menuFg: #ff2a2a;
		--menuHoverFg: #fff;
		--menuHoverBg: #ff4242;
		--menuActiveFg: #fff;
		--menuActiveBg: #d42e2e;
	}

	&.radio {
		--menuActiveFg: var(--MI_THEME-accent);
		--menuActiveBg: var(--MI_THEME-accentedBg);
	}

	&.parent {
		--menuActiveFg: var(--MI_THEME-accent);
		--menuActiveBg: var(--MI_THEME-accentedBg);
	}

	&.label {
		pointer-events: none;
		font-size: 0.7em;
		padding-bottom: 4px;
	}

	&.pending {
		pointer-events: none;
		opacity: 0.7;
	}

	&.none {
		pointer-events: none;
		opacity: 0.7;
	}
}

.item_content {
	width: 100%;
	max-width: 100vw;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	text-overflow: ellipsis;
}

.item_content_text {
	max-width: calc(100vw - 4rem);
	text-overflow: ellipsis;
	overflow: hidden;
}

.switchButton {
	margin-left: -2px;
	--height: 1.35em;
}

.switchText {
	margin-left: 8px;
	overflow: hidden;
	text-overflow: ellipsis;
}

.icon {
	margin-right: 8px;
	line-height: 1;
}

.caret {
	margin-left: auto;
}

.avatar {
	margin-right: 5px;
	width: 20px;
	height: 20px;
}

.indicator {
	display: flex;
	align-items: center;
	color: var(--MI_THEME-indicator);
	font-size: 12px;
}

.divider {
	margin: 8px 0;
	border-top: solid 0.5px var(--MI_THEME-divider);
}

.radioIcon {
	display: inline-block;
	position: relative;
	width: 1em;
	height: 1em;
	vertical-align: -0.125em;
	border-radius: 50%;
	border: solid 2px var(--MI_THEME-divider);
	background-color: var(--MI_THEME-panel);

	&.radioChecked {
		border-color: var(--MI_THEME-accent);

		&::after {
			content: "";
			display: block;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 50%;
			height: 50%;
			border-radius: 50%;
			background-color: var(--MI_THEME-accent);
		}
	}
}
</style>
