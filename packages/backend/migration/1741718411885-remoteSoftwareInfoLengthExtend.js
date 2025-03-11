export class RemoteSoftwareInfoLengthExtend1741718411885 {
	async up(queryRunner) {
		await queryRunner.query(`ALTER TABLE "instance"
			ALTER COLUMN "softwareName" TYPE CHARACTER VARYING(256) USING "softwareName"::CHARACTER VARYING(256);
		ALTER TABLE "instance"
			ALTER COLUMN "softwareVersion" TYPE CHARACTER VARYING(256) USING "softwareVersion"::CHARACTER VARYING(256);`)
	}

	async down(queryRunner) {
		await queryRunner.query(`ALTER TABLE "instance"
			ALTER COLUMN "softwareName" TYPE CHARACTER VARYING(64) USING "softwareName"::CHARACTER VARYING(64);
		ALTER TABLE "instance"
			ALTER COLUMN "softwareVersion" TYPE CHARACTER VARYING(64) USING "softwareVersion"::CHARACTER VARYING(64);`)
	}
}
