import type { FormSubmission } from '@/payload-types'

// Where contact-form notifications are DELIVERED. This is the receive address
// (the getstarted alias) and is intentionally separate from the SMTP send
// identity (admin@gcfactory.com), so we don't fall back to SMTP_FROM_ADDRESS.
export const CONTACT_FORM_NOTIFY_EMAIL =
  process.env.CONTACT_FORM_NOTIFY_EMAIL || 'getstarted@gcfactory.com'

export function formatSubmissionText(submissionData?: FormSubmission['submissionData']): string {
  if (!submissionData?.length) return 'No submission data.'

  return submissionData.map(({ field, value }) => `${field}: ${value ?? ''}`).join('\n')
}

export function getSubmitterEmail(submissionData?: FormSubmission['submissionData']): string | undefined {
  const entry = submissionData?.find(({ field }) => field?.toLowerCase() === 'email')
  const value = entry?.value
  return typeof value === 'string' && value.includes('@') ? value : undefined
}

export function getSubmitterName(submissionData?: FormSubmission['submissionData']): string | undefined {
  const entry = submissionData?.find(({ field }) => {
    const normalized = field?.toLowerCase() ?? ''
    return normalized === 'name' || normalized === 'full-name' || normalized === 'full name'
  })
  const value = entry?.value
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}
