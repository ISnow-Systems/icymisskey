/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {Inject, Injectable} from '@nestjs/common';
import {Endpoint} from '@/server/api/endpoint-base.js';
import type {AbuseUserReportsRepository} from '@/models/_.js';
import {DI} from '@/di-symbols.js';
import {ApiError} from '@/server/api/error.js';
import {AbuseReportService} from '@/core/AbuseReportService.js';

export const meta = {
	tags: ['admin'],

	requireCredential: true,
	requireModerator: true,
	kind: 'write:admin:resolve-abuse-user-report',

	errors: {
		noSuchAbuseReport: {
			message: 'No such abuse report.',
			code: 'NO_SUCH_ABUSE_REPORT',
			id: '15f51cf5-46d1-4b1d-a618-b35bcbed0662',
			kind: 'server',
			httpStatusCode: 404,
		},
	},
} as const;

export const paramDef = {
	type: 'object',
	properties: {
		reportId: {type: 'string', format: 'misskey:id'},
		moderationNote: {type: 'string'},
	},
	required: ['reportId'],
} as const;

@Injectable()
export default class extends Endpoint<typeof meta, typeof paramDef> { // eslint-disable-line import/no-default-export
	constructor(
		@Inject(DI.abuseUserReportsRepository)
		private abuseUserReportsRepository: AbuseUserReportsRepository,
		private abuseReportService: AbuseReportService,
	) {
		super(meta, paramDef, async (ps, me) => {
			const report = await this.abuseUserReportsRepository.findOneBy({id: ps.reportId});
			if (!report) {
				throw new ApiError(meta.errors.noSuchAbuseReport);
			}

			await this.abuseReportService.update(report.id, {
				moderationNote: ps.moderationNote,
			}, me);
		});
	}
}
