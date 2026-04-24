import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_work2" ADD COLUMN IF NOT EXISTS "show_cta_button" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_work2" ADD COLUMN IF NOT EXISTS "cta_button_label" varchar DEFAULT 'More Case Studies';
  ALTER TABLE "pages_blocks_work2" ADD COLUMN IF NOT EXISTS "cta_button_link" varchar DEFAULT '/contact';

  ALTER TABLE "_pages_v_blocks_work2" ADD COLUMN IF NOT EXISTS "show_cta_button" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_work2" ADD COLUMN IF NOT EXISTS "cta_button_label" varchar DEFAULT 'More Case Studies';
  ALTER TABLE "_pages_v_blocks_work2" ADD COLUMN IF NOT EXISTS "cta_button_link" varchar DEFAULT '/contact';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_work2" DROP COLUMN IF EXISTS "show_cta_button";
  ALTER TABLE "pages_blocks_work2" DROP COLUMN IF EXISTS "cta_button_label";
  ALTER TABLE "pages_blocks_work2" DROP COLUMN IF EXISTS "cta_button_link";

  ALTER TABLE "_pages_v_blocks_work2" DROP COLUMN IF EXISTS "show_cta_button";
  ALTER TABLE "_pages_v_blocks_work2" DROP COLUMN IF EXISTS "cta_button_label";
  ALTER TABLE "_pages_v_blocks_work2" DROP COLUMN IF EXISTS "cta_button_link";
  `)
}
