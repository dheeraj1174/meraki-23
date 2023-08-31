export interface IEvent {
	_id: string;
	name: string;
	description: string;
	registrationsStart: string;
	registrationsEnd: string;
	eventStart: string;
	eventEnd: string;
	image: string;
	teamSize: number;
	brochure?: string;
}
