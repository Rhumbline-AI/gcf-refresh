import * as migration_20260707_000000_pov_articles_post_link from './20260707_000000_pov_articles_post_link';
import * as migration_20260626_000000_fix_contact_form_email from './20260626_000000_fix_contact_form_email';
import * as migration_20260409_000221_add_faq_block from './20260409_000221_add_faq_block';
import * as migration_20260306_120000_add_work2_cta from './20260306_120000_add_work2_cta';
import * as migration_20260306_140000_add_hero_background_video from './20260306_140000_add_hero_background_video';
import * as migration_20260306_180000_add_hero_about_headline_image from './20260306_180000_add_hero_about_headline_image';

export const migrations = [
  {
    up: migration_20260707_000000_pov_articles_post_link.up,
    down: migration_20260707_000000_pov_articles_post_link.down,
    name: '20260707_000000_pov_articles_post_link'
  },
  {
    up: migration_20260626_000000_fix_contact_form_email.up,
    down: migration_20260626_000000_fix_contact_form_email.down,
    name: '20260626_000000_fix_contact_form_email'
  },
  {
    up: migration_20260409_000221_add_faq_block.up,
    down: migration_20260409_000221_add_faq_block.down,
    name: '20260409_000221_add_faq_block'
  },
  {
    up: migration_20260306_120000_add_work2_cta.up,
    down: migration_20260306_120000_add_work2_cta.down,
    name: '20260306_120000_add_work2_cta'
  },
  {
    up: migration_20260306_140000_add_hero_background_video.up,
    down: migration_20260306_140000_add_hero_background_video.down,
    name: '20260306_140000_add_hero_background_video'
  },
  {
    up: migration_20260306_180000_add_hero_about_headline_image.up,
    down: migration_20260306_180000_add_hero_about_headline_image.down,
    name: '20260306_180000_add_hero_about_headline_image'
  },
];
