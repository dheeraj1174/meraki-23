export interface LoginValues {
	email: string;
	password: string;
}

export interface RegisterValues {
	name: string;
	email: string;
	password: string;
	confirmPassword?: string;
}

export interface ResetPasswordValues extends LoginValues {
	confirmPassword: string;
}

export type USER_ROLES = "admin" | "user" | "guest";

export interface IUser {
	_id: string;
	name: string;
	email: string;
	role: USER_ROLES;
	avatar?: string;
}
