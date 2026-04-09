import * as migration_20260409_000221_add_faq_block from './20260409_000221_add_faq_block';

export const migrations = [
  {
    up: migration_20260409_000221_add_faq_block.up,
    down: migration_20260409_000221_add_faq_block.down,
    name: '20260409_000221_add_faq_block'
  },
];
