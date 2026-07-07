import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_pov_articles_articles" ADD COLUMN IF NOT EXISTS "post_id" integer;
  ALTER TABLE "pages_blocks_pov_articles_articles" ADD COLUMN IF NOT EXISTS "listing_summary" varchar;

  CREATE INDEX IF NOT EXISTS "pages_blocks_pov_articles_articles_post_idx"
    ON "pages_blocks_pov_articles_articles" ("post_id");

  DO $$ BEGIN
    ALTER TABLE "pages_blocks_pov_articles_articles"
      ADD CONSTRAINT "pages_blocks_pov_articles_articles_post_id_posts_id_fk"
      FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id")
      ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  ALTER TABLE "_pages_v_blocks_pov_articles_articles" ADD COLUMN IF NOT EXISTS "post_id" integer;
  ALTER TABLE "_pages_v_blocks_pov_articles_articles" ADD COLUMN IF NOT EXISTS "listing_summary" varchar;

  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_pov_articles_articles_post_idx"
    ON "_pages_v_blocks_pov_articles_articles" ("post_id");

  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_pov_articles_articles"
      ADD CONSTRAINT "_pages_v_blocks_pov_articles_articles_post_id_posts_id_fk"
      FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id")
      ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_pov_articles_articles"
    DROP CONSTRAINT IF EXISTS "pages_blocks_pov_articles_articles_post_id_posts_id_fk";
  DROP INDEX IF EXISTS "pages_blocks_pov_articles_articles_post_idx";
  ALTER TABLE "pages_blocks_pov_articles_articles" DROP COLUMN IF EXISTS "post_id";
  ALTER TABLE "pages_blocks_pov_articles_articles" DROP COLUMN IF EXISTS "listing_summary";

  ALTER TABLE "_pages_v_blocks_pov_articles_articles"
    DROP CONSTRAINT IF EXISTS "_pages_v_blocks_pov_articles_articles_post_id_posts_id_fk";
  DROP INDEX IF EXISTS "_pages_v_blocks_pov_articles_articles_post_idx";
  ALTER TABLE "_pages_v_blocks_pov_articles_articles" DROP COLUMN IF EXISTS "post_id";
  ALTER TABLE "_pages_v_blocks_pov_articles_articles" DROP COLUMN IF EXISTS "listing_summary";
  `)
}
