import type { Block } from 'payload'

import { link } from '@/fields/link'

export const Capabilities: Block = {
  slug: 'capabilities',
  labels: {
    singular: 'Capabilities',
    plural: 'Capabilities',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Where Growth Fuel Ignites',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Capability Items',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
        {
          name: 'enableLink',
          type: 'checkbox',
          label: 'Enable Link',
          defaultValue: true,
        },
        link({
          appearances: false,
          overrides: {
            admin: {
              condition: (_data, siblingData) => Boolean(siblingData?.enableLink),
            },
          },
        }),
      ],
    },
  ],
}
