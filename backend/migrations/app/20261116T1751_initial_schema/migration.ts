#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/c77e9ad10d6d2dbc86fcfd911afdd9ae5b688bca1adc704fe252d722f4b9fc17/contract';
import endContract from '../../snapshots/c77e9ad10d6d2dbc86fcfd911afdd9ae5b688bca1adc704fe252d722f4b9fc17/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Agent',
        columns: [
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('AGENT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('Agent_role_check_7ef290b3', sql`"role" IN ('AGENT', 'ADMIN')`),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Lead',
        columns: [
          col('agentId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('commercialInterest', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isNewCustomer', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('leadDate', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('phone', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('source', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('NEW'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('version', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Lead_status_check_b706e08a',
            sql`"status" IN ('NEW', 'IN_PROGRESS', 'CONTACTED', 'CLOSED')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'ScoringConfiguration',
        columns: [
          col('active', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('version', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ScoringCriterion',
        columns: [
          col('configurationId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('weight', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Agent',
        constraint: 'Agent_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'ScoringConfiguration',
        constraint: 'ScoringConfiguration_version_key',
        columns: ['version'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'ScoringCriterion',
        constraint: 'ScoringCriterion_configurationId_name_key',
        columns: ['configurationId', 'name'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Lead',
        index: 'Lead_agentId_idx_8d0ba4f0',
        columns: ['agentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Lead',
        index: 'Lead_name_idx_ce87e6ba',
        columns: ['name'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Lead',
        index: 'Lead_phone_idx_8db23f45',
        columns: ['phone'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Lead',
        index: 'Lead_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ScoringConfiguration',
        index: 'ScoringConfiguration_active_idx_8af4daed',
        columns: ['active'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ScoringCriterion',
        index: 'ScoringCriterion_configurationId_idx_9f879af3',
        columns: ['configurationId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Lead',
        foreignKey: {
          name: 'Lead_agentId_fkey',
          columns: ['agentId'],
          references: { schema: 'public', table: 'Agent', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ScoringCriterion',
        foreignKey: {
          name: 'ScoringCriterion_configurationId_fkey',
          columns: ['configurationId'],
          references: { schema: 'public', table: 'ScoringConfiguration', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
