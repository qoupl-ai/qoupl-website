/**
 * Form Validation Schemas
 *
 * Centralized Zod schemas for all user-facing forms.
 * Includes anti-spam measures (honeypot fields).
 */

import { z } from 'zod'

/**
 * Waitlist Form Schema
 *
 * Validates waitlist signup submissions.
 * Includes honeypot field for spam protection.
 */
export const waitlistSchema = z
  .object({
    // Real fields
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters')
      .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),

    email: z
      .string()
      .email('Invalid email address')
      .toLowerCase()
      .max(255, 'Email is too long'),

    phone: z
      .string()
      .regex(
        /^\+?[1-9]\d{1,14}$/,
        'Invalid phone number. Use international format (e.g., +1234567890)'
      )
      .min(10, 'Phone number is too short')
      .max(15, 'Phone number is too long'),

    gender: z.enum(['male', 'female', 'other']),

    age: z.number().int().min(18).max(25),

    lookingFor: z.enum(['friendship', 'dating', 'serious']),

    // Honeypot field (should remain empty)
    website: z.string().optional(),
  })
  .refine((data) => !data.website, {
    message: 'Invalid submission detected',
    path: ['website'],
  })

export type WaitlistFormData = z.infer<typeof waitlistSchema>

/**
 * Waitlist Form Input Schema
 *
 * Used for parsing FormData where age comes as string
 */
export const waitlistInputSchema = waitlistSchema.extend({
  age: z.coerce.number().int().min(18).max(25),
})

/**
 * Contact Form Schema
 *
 * Validates contact form submissions.
 * Includes honeypot field for spam protection.
 */
export const contactSchema = z
  .object({
    // Real fields
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters')
      .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),

    email: z
      .string()
      .email('Invalid email address')
      .toLowerCase()
      .max(255, 'Email is too long'),

    subject: z
      .string()
      .min(3, 'Subject must be at least 3 characters')
      .max(200, 'Subject must be less than 200 characters')
      .trim(),

    message: z
      .string()
      .min(10, 'Message must be at least 10 characters')
      .max(2000, 'Message must be less than 2000 characters')
      .trim(),

    // Honeypot field (should remain empty)
    website: z.string().optional(),
  })
  .refine((data) => !data.website, {
    message: 'Invalid submission detected',
    path: ['website'],
  })

export type ContactFormData = z.infer<typeof contactSchema>

/**
 * Helper function to safely parse form data
 */
export const parseFormData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } => {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  // Flatten Zod errors for easier consumption
  const errors: Record<string, string[]> = {}
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.')
    if (!errors[path]) {
      errors[path] = []
    }
    errors[path].push(issue.message)
  })

  return { success: false, errors }
}

/**
 * Sanitize user input to prevent XSS attacks
 *
 * Basic sanitization - for production, consider using DOMPurify
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
}

/**
 * Validate and sanitize form data in one step
 */
export const validateAndSanitize = <T extends Record<string, unknown>>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } => {
  const result = parseFormData(schema, data)

  if (!result.success) {
    return result
  }

  // Sanitize string fields - create new object to avoid mutation issues
  const sanitized: Record<string, unknown> = {}
  Object.keys(result.data).forEach((key) => {
    const value = result.data[key]
    sanitized[key] = typeof value === 'string' ? sanitizeInput(value) : value
  })

  return { success: true, data: sanitized as T }
}
