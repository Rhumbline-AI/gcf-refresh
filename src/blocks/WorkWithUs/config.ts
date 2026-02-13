import type { Block } from 'payload'

export const WorkWithUs: Block = {
  slug: 'workWithUs',
  labels: {
    singular: 'Work With Us',
    plural: 'Work With Us',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: 'Work With Us',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Circle Image',
      required: false,
    },
  ],
}
