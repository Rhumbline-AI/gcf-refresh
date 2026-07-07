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
      admin: {
        description:
          'Link published posts to list on the POV page. Upload each post\'s Publication Logo under Posts → Content (not here). Optionally add a short POV listing summary below each link.',
      },
      fields: [
        {
          name: 'post',
          type: 'relationship',
          relationTo: 'posts',
          label: 'Article (Post)',
          required: false,
          admin: {
            description:
              'Select a published post. Its title, publication logo, and link are pulled automatically from the post.',
          },
          filterOptions: {
            _status: {
              equals: 'published',
            },
          },
        },
        {
          name: 'listingSummary',
          type: 'textarea',
          label: 'POV Listing Summary (optional)',
          admin: {
            description:
              'Short blurb shown on the POV page. Leave blank to use the post\'s SEO description (Posts → SEO tab).',
            condition: (_, siblingData) => Boolean(siblingData?.post),
          },
        },
        // Legacy manual fields — shown only for rows created before post linking.
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Publication Logo (legacy)',
          required: false,
          admin: {
            condition: (_, siblingData) => !siblingData?.post,
            description: 'Legacy field. Prefer linking a Post above — set its Publication Logo on the post instead.',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Article Title (legacy)',
          required: false,
          admin: {
            condition: (_, siblingData) => !siblingData?.post,
            description: 'Legacy field. Prefer linking a Post above.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description (legacy)',
          required: false,
          admin: {
            condition: (_, siblingData) => !siblingData?.post,
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Article URL (legacy)',
          required: false,
          admin: {
            condition: (_, siblingData) => !siblingData?.post,
          },
        },
      ],
    },
  ],
}
