/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as Misskey from 'misskey-js';
import {$i} from '@/account.js';

export function isFollowingVisibleForMe(user: Misskey.entities.UserDetailed): boolean {
	if ($i && ($i.id === user.id || $i.isAdmin || $i.isModerator)) return true;

	if (user.followingVisibility === 'private') return false;
	return !(user.followingVisibility === 'followers' && !user.isFollowing);


}

export function isFollowersVisibleForMe(user: Misskey.entities.UserDetailed): boolean {
	if ($i && ($i.id === user.id || $i.isAdmin || $i.isModerator)) return true;

	if (user.followersVisibility === 'private') return false;
	return !(user.followersVisibility === 'followers' && !user.isFollowing);


}
