import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'About',
          value: 'aboutHero',
        },
        {
          label: 'Work',
          value: 'workHero',
        },
        {
          label: 'Contact',
          value: 'contactHero',
        },
        {
          label: 'POV',
          value: 'povHero',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) =>
          ['highImpact', 'mediumImpact', 'contactHero'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'backgroundVideo',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => type === 'contactHero',
        description:
          'Optional background video (MP4). When provided, plays muted and loops behind the form. Falls back to the image above if not set.',
      },
      relationTo: 'media',
      label: 'Background Video',
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      admin: {
        condition: (_, { type } = {}) => type === 'contactHero',
      },
      label: 'Contact Form',
    },
    {
      name: 'quotes',
      type: 'array',
      label: 'Quotes',
      admin: {
        condition: (_, { type } = {}) => type === 'povHero',
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          label: 'Quote Text',
          required: true,
        },
        {
          name: 'attribution',
          type: 'text',
          label: 'Attribution (name)',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          label: 'Role / Title',
        },
      ],
    },
  ],
  label: false,
}
