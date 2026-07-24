'use server'

import { sendPropertyIssueEmail } from '@/lib/email'
import { verifyTurnstile } from '@/lib/turnstile'

export type PropertyIssueState = {
  type: 'success' | 'error'
  message: string
} | null

export async function submitPropertyIssue(
  _prev: PropertyIssueState,
  formData: FormData,
): Promise<PropertyIssueState> {
  const name    = ((formData.get('name')    as string) ?? '').trim()
  const email   = ((formData.get('email')   as string) ?? '').trim()
  const phone   = ((formData.get('phone')   as string) ?? '').trim()
  const message = ((formData.get('message') as string) ?? '').trim()
  const token   = (formData.get('cf-turnstile-response') as string) ?? ''

  if (!name || !email || !phone || !message) {
    return { type: 'error', message: 'Please fill in all fields.' }
  }

  const verified = await verifyTurnstile(token, null)
  if (!verified) {
    return { type: 'error', message: 'Verification failed. Please try again.' }
  }

  const sent = await sendPropertyIssueEmail({ name, email, phone, message })
  if (!sent) {
    return { type: 'error', message: 'Something went wrong sending your report. Please try again or contact the VP of Property Management directly.' }
  }

  return { type: 'success', message: 'Thanks — your report has been submitted.' }
}
