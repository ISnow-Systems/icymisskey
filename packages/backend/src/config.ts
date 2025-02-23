/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';
import * as yaml from 'js-yaml';
import * as Sentry from '@sentry/node';
import type {RedisOptions} from 'ioredis';

type RedisOptionsSource = Partial<RedisOptions> & {
	host: string;
	port: number;
	family?: number;
	pass: string;
	db?: number;
	prefix?: string;
};

/**
 * 設定ファイルの型
 */
type Source = {
	url?: string;
	port?: number;
	socket?: string;
	chmodSocket?: string;
	disableHsts?: boolean;
	db: {
		host: string;
		port: number;
		db?: string;
		user?: string;
		pass?: string;
		disableCache?: boolean;
		timeout?: number;
		extra?: { [x: string]: string };
	};
	dbReplications?: boolean;
	dbSlaves?: {
		host: string;
		port: number;
		db: string;
		user: string;
		pass: string;
	}[];
	redis: RedisOptionsSource;
	redisForPubsub?: RedisOptionsSource;
	redisForJobQueue?: RedisOptionsSource;
	redisForTimelines?: RedisOptionsSource;
	redisForReactions?: RedisOptionsSource;
	fulltextSearch?: {
		provider?: FulltextSearchProvider;
	};
	meilisearch?: {
		host: string;
		port: string;
		apiKey: string;
		ssl?: boolean;
		index: string;
		scope?: 'local' | 'global' | string[];
	};
	sentryForBackend?: { options: Partial<Sentry.NodeOptions>; enableNodeProfiling: boolean; };
	sentryForFrontend?: { options: Partial<Sentry.NodeOptions> };

	publishTarballInsteadOfProvideRepositoryUrl?: boolean;

	setupPassword?: string;

	proxy?: string;
	proxySmtp?: string;
	proxyBypassHosts?: string[];

	allowedPrivateNetworks?: string[];

	maxFileSize?: number;

	clusterLimit?: number;
	unlockWorkerProcessLimitByCpu?: boolean;

	id: string;

	outgoingAddress?: string;
	outgoingAddressFamily?: 'ipv4' | 'ipv6' | 'dual';

	queueConfig: {
		concurrency: {
			deliver?: number;
			inbox?: number;
			relationship?: number;
			userWebhook?: number;
			systemWebhook?: number;
			objectStorage?: number;
		},
		rateLimit: {
			deliver?: number;
			inbox?: number;
			relationship?: number;
			userWebhook?: number;
			systemWebhook?: number;
			objectStorage?: number;
		},
		attempts: {
			deliver?: number;
			inbox?: number;
		}
	},

	mediaProxy?: string;
	proxyRemoteFiles?: boolean;
	videoThumbnailGenerator?: string;

	signToActivityPubGet?: boolean;

	perChannelMaxNoteCacheCount?: number;
	perUserNotificationsMaxCount?: number;
	deactivateAntennaThreshold?: number;
	pidFile: string;

	logging?: {
		sql?: {
			disableQueryTruncation?: boolean,
			enableQueryParamLogging?: boolean,
		}
	}
};

export type Config = {
	url: string;
	port: number;
	socket: string | undefined;
	chmodSocket: string | undefined;
	disableHsts: boolean | undefined;
	db: {
		host: string;
		port: number;
		db: string;
		user: string;
		pass: string;
		disableCache?: boolean;
		timeout: number;
		extra?: { [x: string]: string };
	};
	dbReplications: boolean | undefined;
	dbSlaves: {
		host: string;
		port: number;
		db: string;
		user: string;
		pass: string;
	}[] | undefined;
	fulltextSearch?: {
		provider?: FulltextSearchProvider;
	};
	meilisearch: {
		host: string;
		port: string;
		apiKey: string;
		ssl?: boolean;
		index: string;
		scope?: 'local' | 'global' | string[];
	} | undefined;
	proxy: string | undefined;
	proxySmtp: string | undefined;
	proxyBypassHosts: string[] | undefined;
	allowedPrivateNetworks: string[] | undefined;
	maxFileSize: number;
	clusterLimit: number | undefined;
	unlockWorkerProcessLimitByCpu: boolean | undefined;
	id: string;
	outgoingAddress: string | undefined;
	outgoingAddressFamily: 'ipv4' | 'ipv6' | 'dual' | undefined;
	queueConfig: {
		concurrency: {
			deliver: number | undefined;
			inbox: number | undefined;
			relationship: number | undefined;
			userWebhook: number | undefined;
			systemWebhook: number | undefined;
			objectStorage: number | undefined;
		},
		rateLimit: {
			deliver: number | undefined;
			inbox: number | undefined;
			relationship: number | undefined;
			userWebhook: number | undefined;
			systemWebhook: number | undefined;
			objectStorage: number | undefined;
		},
		attempts: {
			deliver: number | undefined;
			inbox: number | undefined;
		}
	},
	proxyRemoteFiles: boolean | undefined;
	signToActivityPubGet: boolean | undefined;
	logging?: {
		sql?: {
			disableQueryTruncation?: boolean,
			enableQueryParamLogging?: boolean,
		}
	}

	version: string;
	publishTarballInsteadOfProvideRepositoryUrl: boolean;
	setupPassword: string | undefined;
	host: string;
	hostname: string;
	scheme: string;
	wsScheme: string;
	apiUrl: string;
	wsUrl: string;
	authUrl: string;
	driveUrl: string;
	userAgent: string;
	frontendEntry: string;
	frontendManifestExists: boolean;
	frontendEmbedEntry: string;
	frontendEmbedManifestExists: boolean;
	mediaProxy: string;
	externalMediaProxyEnabled: boolean;
	videoThumbnailGenerator: string | null;
	redis: RedisOptions & RedisOptionsSource;
	redisForPubsub: RedisOptions & RedisOptionsSource;
	redisForJobQueue: RedisOptions & RedisOptionsSource;
	redisForTimelines: RedisOptions & RedisOptionsSource;
	redisForReactions: RedisOptions & RedisOptionsSource;
	sentryForBackend: { options: Partial<Sentry.NodeOptions>; enableNodeProfiling: boolean; } | undefined;
	sentryForFrontend: { options: Partial<Sentry.NodeOptions> } | undefined;
	perChannelMaxNoteCacheCount: number;
	perUserNotificationsMaxCount: number;
	deactivateAntennaThreshold: number;
	pidFile: string;
};

export type FulltextSearchProvider = 'sqlLike' | 'sqlPgroonga' | 'meilisearch';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

/**
 * Path of configuration directory
 */
const dir = `${_dirname}/../../../.config`;

/**
 * Path of configuration file
 */
const path = process.env.MISSKEY_CONFIG_YML
	? resolve(dir, process.env.MISSKEY_CONFIG_YML)
	: process.env.NODE_ENV === 'test'
		? resolve(dir, 'test.yml')
		: resolve(dir, 'default.yml');

export function loadConfig(): Config {
	const meta = JSON.parse(fs.readFileSync(`${_dirname}/../../../built/meta.json`, 'utf-8'));

	const frontendManifestExists = fs.existsSync(_dirname + '/../../../built/_frontend_vite_/manifest.json');
	const frontendEmbedManifestExists = fs.existsSync(_dirname + '/../../../built/_frontend_embed_vite_/manifest.json');
	const frontendManifest = frontendManifestExists ?
		JSON.parse(fs.readFileSync(`${_dirname}/../../../built/_frontend_vite_/manifest.json`, 'utf-8'))
		: {'src/_boot_.ts': {file: 'src/_boot_.ts'}};
	const frontendEmbedManifest = frontendEmbedManifestExists ?
		JSON.parse(fs.readFileSync(`${_dirname}/../../../built/_frontend_embed_vite_/manifest.json`, 'utf-8'))
		: {'src/boot.ts': {file: 'src/boot.ts'}};

	const config = yaml.load(fs.readFileSync(path, 'utf-8')) as Source;

	const url = tryCreateUrl(config.url ?? process.env.MISSKEY_URL ?? '');
	const version = meta.version;
	const host = url.host;
	const hostname = url.hostname;
	const scheme = url.protocol.replace(/:$/, '');
	const wsScheme = scheme.replace('http', 'ws');

	const dbDb = config.db.db ?? process.env.DATABASE_DB ?? '';
	const dbUser = config.db.user ?? process.env.DATABASE_USER ?? '';
	const dbPass = config.db.pass ?? process.env.DATABASE_PASSWORD ?? '';
	const dbTimeout = config.db.timeout ?? 10;

	const externalMediaProxy = config.mediaProxy ?
		config.mediaProxy.endsWith('/') ? config.mediaProxy.substring(0, config.mediaProxy.length - 1) : config.mediaProxy
		: null;
	const internalMediaProxy = `${scheme}://${host}/proxy`;
	const redis = convertRedisOptions(config.redis, host);

	return {
		version,
		publishTarballInsteadOfProvideRepositoryUrl: !!config.publishTarballInsteadOfProvideRepositoryUrl,
		setupPassword: config.setupPassword,
		url: url.origin,
		port: config.port ?? parseInt(process.env.PORT ?? '', 10),
		socket: config.socket,
		chmodSocket: config.chmodSocket,
		disableHsts: config.disableHsts,
		host,
		hostname,
		scheme,
		wsScheme,
		wsUrl: `${wsScheme}://${host}`,
		apiUrl: `${scheme}://${host}/api`,
		authUrl: `${scheme}://${host}/auth`,
		driveUrl: `${scheme}://${host}/files`,
		db: {...config.db, db: dbDb, user: dbUser, pass: dbPass, timeout: dbTimeout},
		dbReplications: config.dbReplications,
		dbSlaves: config.dbSlaves,
		fulltextSearch: config.fulltextSearch,
		meilisearch: config.meilisearch,
		redis,
		redisForPubsub: config.redisForPubsub ? convertRedisOptions(config.redisForPubsub, host) : redis,
		redisForJobQueue: config.redisForJobQueue ? convertRedisOptions(config.redisForJobQueue, host) : redis,
		redisForTimelines: config.redisForTimelines ? convertRedisOptions(config.redisForTimelines, host) : redis,
		redisForReactions: config.redisForReactions ? convertRedisOptions(config.redisForReactions, host) : redis,
		sentryForBackend: config.sentryForBackend,
		sentryForFrontend: config.sentryForFrontend,
		id: config.id,
		proxy: config.proxy,
		proxySmtp: config.proxySmtp,
		proxyBypassHosts: config.proxyBypassHosts,
		allowedPrivateNetworks: config.allowedPrivateNetworks,
		maxFileSize: config.maxFileSize ?? 262144000,
		clusterLimit: config.clusterLimit,
		unlockWorkerProcessLimitByCpu: config.unlockWorkerProcessLimitByCpu,
		outgoingAddress: config.outgoingAddress,
		outgoingAddressFamily: config.outgoingAddressFamily,
		queueConfig: {
			concurrency: {
				deliver: config.queueConfig.concurrency.deliver,
				userWebhook: config.queueConfig.concurrency.userWebhook,
				systemWebhook: config.queueConfig.concurrency.systemWebhook,
				inbox: config.queueConfig.concurrency.inbox,
				objectStorage: config.queueConfig.concurrency.objectStorage,
				relationship: config.queueConfig.concurrency.relationship,
			},
			rateLimit: {
				deliver: config.queueConfig.rateLimit.deliver,
				userWebhook: config.queueConfig.rateLimit.userWebhook,
				systemWebhook: config.queueConfig.rateLimit.systemWebhook,
				inbox: config.queueConfig.rateLimit.inbox,
				objectStorage: config.queueConfig.rateLimit.objectStorage,
				relationship: config.queueConfig.rateLimit.relationship,
			},
			attempts: {
				deliver: config.queueConfig.attempts.deliver,
				inbox: config.queueConfig.attempts.inbox,
			}
		},
		proxyRemoteFiles: config.proxyRemoteFiles,
		signToActivityPubGet: config.signToActivityPubGet ?? true,
		mediaProxy: externalMediaProxy ?? internalMediaProxy,
		externalMediaProxyEnabled: externalMediaProxy !== null && externalMediaProxy !== internalMediaProxy,
		videoThumbnailGenerator: config.videoThumbnailGenerator ?
			config.videoThumbnailGenerator.endsWith('/') ? config.videoThumbnailGenerator.substring(0, config.videoThumbnailGenerator.length - 1) : config.videoThumbnailGenerator
			: null,
		userAgent: `Misskey/${version} (${config.url})`,
		frontendEntry: frontendManifest['src/_boot_.ts'],
		frontendManifestExists: frontendManifestExists,
		frontendEmbedEntry: frontendEmbedManifest['src/boot.ts'],
		frontendEmbedManifestExists: frontendEmbedManifestExists,
		perChannelMaxNoteCacheCount: config.perChannelMaxNoteCacheCount ?? 1000,
		perUserNotificationsMaxCount: config.perUserNotificationsMaxCount ?? 500,
		deactivateAntennaThreshold: config.deactivateAntennaThreshold ?? (1000 * 60 * 60 * 24 * 7),
		pidFile: config.pidFile,
		logging: config.logging,
	};
}

function tryCreateUrl(url: string) {
	try {
		return new URL(url);
	} catch (e) {
		throw new Error(`url="${url}" is not a valid URL.`);
	}
}

function convertRedisOptions(options: RedisOptionsSource, host: string): RedisOptions & RedisOptionsSource {
	return {
		...options,
		password: options.pass,
		prefix: options.prefix ?? host,
		family: options.family ?? 0,
		keyPrefix: `${options.prefix ?? host}:`,
		db: options.db ?? 0,
	};
}
