/*
 * SPDX-FileCopyrightText: syuilo and other misskey contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export class ReplaceSomeUrls1692404959249 {
	async up(queryRunner) {
		await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "feedbackUrl"`);
		await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "repositoryUrl"`);
		await queryRunner.query(`ALTER TABLE "meta"
			ADD "repositoryUrl" character varying(512) NOT NULL DEFAULT 'https://github.com/ISnow-Systems/icymisskey'`);
		await queryRunner.query(`ALTER TABLE "meta"
			ADD "feedbackUrl" character varying(512) DEFAULT 'https://github.com/ISnow-Systems/icymisskey/issues/new'`);
	}

	async down(queryRunner) {
		await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "feedbackUrl"`);
		await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "repositoryUrl"`);
		await queryRunner.query(`ALTER TABLE "meta"
			ADD "repositoryUrl" character varying(512) NOT NULL DEFAULT 'https://github.com/misskey-dev/misskey'`);
		await queryRunner.query(`ALTER TABLE "meta"
			ADD "feedbackUrl" character varying(512) DEFAULT 'https://github.com/misskey-dev/misskey/issues/new'`);
	}
}
