import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

const NOTIFY_EMAIL = process.env.CONTACT_FORM_NOTIFY_EMAIL || 'admin@gcfactory.com'

const contactFormNotificationEmail = {
  emailTo: NOTIFY_EMAIL,
  replyTo: '{{email}}',
  subject: 'New contact form submission from {{name}}',
  message: {
    root: {
      type: 'root' as const,
      children: [
        {
          type: 'paragraph' as const,
          children: [
            {
              type: 'text' as const,
              detail: 0,
              format: 0,
              mode: 'normal' as const,
              style: '',
              text: 'You have a new contact form submission:',
              version: 1,
            },
          ],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          textFormat: 0 as const,
          version: 1,
        },
        {
          type: 'paragraph' as const,
          children: [
            {
              type: 'text' as const,
              detail: 0,
              format: 0,
              mode: 'normal' as const,
              style: '',
              text: '{{*:table}}',
              version: 1,
            },
          ],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          textFormat: 0 as const,
          version: 1,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  },
}

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const { docs } = await payload.find({
    collection: 'forms',
    limit: 20,
    depth: 0,
  })

  const contactForms = docs.filter((form) => {
    const title = form.title?.toLowerCase() ?? ''
    return title === 'contact' || title === 'contact form'
  })

  for (const form of contactForms) {
    const hasRecipient = form.emails?.some((email) => email.emailTo?.trim())
    if (hasRecipient) continue

    await payload.update({
      collection: 'forms',
      id: form.id,
      data: {
        emails: [contactFormNotificationEmail],
      },
    })
  }
}

export async function down(): Promise<void> {
  // Non-destructive: leave CMS email settings as configured.
}
