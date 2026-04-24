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
        description:
          'Select up to 3 projects. First appears as large circle on top, second two appear as smaller circles on bottom.',
      },
    },
    {
      name: 'showCtaButton',
      type: 'checkbox',
      label: 'Show "More Case Studies" button below this section',
      defaultValue: false,
      admin: {
        description: 'Enable this on the last Work section of the Work page.',
      },
    },
    {
      name: 'ctaButtonLabel',
      type: 'text',
      label: 'Button Label',
      defaultValue: 'More Case Studies',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.showCtaButton),
      },
    },
    {
      name: 'ctaButtonLink',
      type: 'text',
      label: 'Button Link (URL or path, e.g. /work or /contact)',
      defaultValue: '/contact',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.showCtaButton),
      },
    },
  ],
}
