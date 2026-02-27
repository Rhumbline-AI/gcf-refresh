import type { Block } from 'payload'

export const POVArticles: Block = {
  slug: 'povArticles',
  labels: {
    singular: 'POV Articles',
    plural: 'POV Articles',
  },
  fields: [
    {
      name: 'articles',
      type: 'array',
      label: 'Articles',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Publication Logo',
          required: false,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Article Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: false,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Article URL',
          required: false,
        },
      ],
    },
  ],
}
