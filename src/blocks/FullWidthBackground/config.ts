import type { Block } from 'payload'

export const FullWidthBackground: Block = {
  slug: 'fullWidthBackground',
  labels: {
    singular: 'Full Width Background',
    plural: 'Full Width Backgrounds',
  },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
      required: true,
    },
    {
      name: 'height',
      type: 'select',
      label: 'Section Height',
      defaultValue: 'medium',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
    },
    {
      name: 'grayscale',
      type: 'checkbox',
      label: 'Apply Grayscale Filter',
      defaultValue: true,
    },
    {
      name: 'overlapPrevious',
      type: 'checkbox',
      label: 'Allow Previous Section to Overlap',
      defaultValue: true,
    },
  ],
}
