import { USER_ROLES as ROLES } from "@/types/auth";

export const USER_ROLES: {
	[key: string]: ROLES;
} = {
	ADMIN: "admin",
	USER: "user",
	GUEST: "guest",
};

export const RESPONSE_MESSAGES = {
	SUCCESS: "Success",
	FAILED: "Failed",
	SERVER_ERROR: "Internal Server Error",
};

export const TEAM_PARTICIPATION_STATUS = {
	ACCEPTED: "accepted",
	PENDING: "pending",
	REJECTED: "rejected",
};

export const OTP_TYPES = {
	REGISTER: "register",
	RESET_PASSWORD: "reset_password",
};
