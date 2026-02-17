import type { Block } from 'payload'

export const Work2: Block = {
  slug: 'work2',
  labels: {
    singular: 'Work Section 2 (Inverted)',
    plural: 'Work Sections 2',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'The work',
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      minRows: 1,
      maxRows: 3,
      label: 'Select 3 Projects',
      required: false,
      admin: {
        description: 'Select up to 3 projects. First appears as large circle on top, second two appear as smaller circles on bottom.',
      },
    },
  ],
}
