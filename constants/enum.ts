/* eslint-disable no-unused-vars */
import { USER_ROLES as ROLES } from "@/types/auth";
import { PERSON_ROLES as TEAM_PERSON_ROLES } from "@/types/people";

export const USER_ROLES: {
	[key in "ADMIN" | "USER" | "GUEST"]: ROLES;
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

export const PERSON_ROLE: {
	[key in
		| "FACULTY_COORDINATOR"
		| "ALUMNI"
		| "STUDENT_COORDINATOR"
		| "DEVELOPMENT_TEAM"]: TEAM_PERSON_ROLES;
} = {
	FACULTY_COORDINATOR: "faculty-coordinator",
	ALUMNI: "alumni",
	STUDENT_COORDINATOR: "student-coordinator",
	DEVELOPMENT_TEAM: "development-team",
};
