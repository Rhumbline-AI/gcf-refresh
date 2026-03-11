import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import formatSlug from '../utilities/formatSlug'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Project Title (used in work circles)',
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Project thumbnail image (for work circles)',
      },
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: 'Description',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Case Study',
          fields: [
            {
              name: 'clientName',
              type: 'text',
              label: 'Client Name',
              admin: {
                description: 'e.g. "The Venetian Resort Las Vegas"',
              },
            },
            {
              name: 'campaignTitle',
              type: 'text',
              label: 'Campaign Title',
              admin: {
                description: 'e.g. "Dinner!"',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitle',
              admin: {
                description: 'e.g. "Record growth from an under-appreciated experience."',
              },
            },
            {
              name: 'problem',
              type: 'textarea',
              label: 'Problem',
            },
            {
              name: 'spark',
              type: 'textarea',
              label: 'Spark',
            },
            {
              name: 'growthFuel',
              type: 'textarea',
              label: 'Growth Fuel',
            },
            {
              name: 'results',
              type: 'textarea',
              label: 'Results',
              admin: {
                description: 'Text that appears inside the blue results circle',
              },
            },
            {
              name: 'contentBlocks',
              type: 'array',
              label: 'Content Blocks',
              admin: {
                description: 'Alternating image/video blocks with captions',
              },
              fields: [
                {
                  name: 'media',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Image or Video',
                },
                {
                  name: 'aspectRatio',
                  type: 'select',
                  label: 'Aspect Ratio',
                  required: true,
                  defaultValue: '16:9',
                  options: [
                    { label: '16:9 (Landscape)', value: '16:9' },
                    { label: '9:16 (Portrait)', value: '9:16' },
                    { label: '1:1 (Square)', value: '1:1' },
                  ],
                },
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Caption',
                  admin: {
                    description: 'Optional text caption for this media block',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                  admin: {
                    description: 'Optional paragraph description below the caption',
                  },
                },
              ],
            },
            {
              name: 'caseStudyContent',
              type: 'richText',
              label: 'Additional Content',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
              admin: {
                description: 'Additional content blocks below the case study sections',
              },
            },
          ],
        },
      ],
    },
  ],
}
