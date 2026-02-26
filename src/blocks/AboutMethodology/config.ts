import type { Block } from 'payload'

export const AboutMethodology: Block = {
  slug: 'aboutMethodology',
  labels: {
    singular: 'About Methodology',
    plural: 'About Methodologies',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Methodology Steps',
      minRows: 4,
      maxRows: 4,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Circle Image',
          required: false,
        },
      ],
    },
    {
      name: 'overlayImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Overlay Image (large photo overlapping the grid)',
      required: false,
    },
  ],
}
