import * as migration_20260409_000221_add_faq_block from './20260409_000221_add_faq_block';
import * as migration_20260306_120000_add_work2_cta from './20260306_120000_add_work2_cta';
import * as migration_20260306_140000_add_hero_background_video from './20260306_140000_add_hero_background_video';

export const migrations = [
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
];
