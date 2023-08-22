// Server configs
export const dbUri: string =
	process.env.NEXT_PUBLIC_APP_DB_URI ?? "mongodb://localhost:27017/nextjs";
export const jwtSecret: string =
	process.env.NEXT_PUBLIC_APP_JWT_SECRET ?? "secret";

// Google Auth Configs
export const googleClientId = process.env
	.NEXT_PUBLIC_APP_GOOGLE_CLIENT_ID as string;
export const googleClientSecret = process.env
	.NEXT_PUBLIC_APP_GOOGLE_CLIENT_SECRET as string;
export const googleRefreshToken = process.env
	.NEXT_PUBLIC_APP_GOOGLE_REFRESH_TOKEN as string;
export const googleRedirectUri = process.env
	.NEXT_PUBLIC_APP_GOOGLE_REDIRECT_URI as string;
export const googleEmail = process.env.NEXT_PUBLIC_APP_GOOGLE_EMAIL as string;
