export type PERSON_ROLES =
	| "faculty-coordinator"
	| "student-coordinator"
	| "alumni"
	| "development-team";

export interface IPerson {
	name: string;
	image: string;
	bio: string;
	twitter?: string;
	linkedin?: string;
	instagram?: string;
	email: string;
	role: PERSON_ROLES;
}
