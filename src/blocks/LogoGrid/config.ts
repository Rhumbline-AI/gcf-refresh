import type { Block } from 'payload'

export const LogoGrid: Block = {
  slug: 'logoGrid',
  labels: {
    singular: 'Logo Grid',
    plural: 'Logo Grids',
  },
  fields: [
    {
      name: 'logos',
      type: 'array',
      label: 'Logos',
      minRows: 1,
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
