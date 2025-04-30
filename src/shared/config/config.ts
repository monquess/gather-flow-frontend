import { z } from 'zod'

const configSchema = z.object({
	VITE_API_BASE_URL: z.string().url(),
	VITE_DEFAULT_POSTER_URL: z.string().url(),
	VITE_GOOGLE_RECAPTCHA_SITE_KEY: z.string(),
	VITE_GOOGLE_API: z.string(),
	VITE_STRIPE_PUBLISHABLE_KEY: z.string(),
})

const env = configSchema.parse(import.meta.env)

type Config = {
	[K in keyof z.infer<typeof configSchema> as K extends `VITE_${infer R}`
		? R
		: never]: string
}

export const config = Object.fromEntries(
	Object.entries(env).map(([key, value]) => [key.replace('VITE_', ''), value])
) as Config
