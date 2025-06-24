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

export interface IStat {
	event: {
		id: string;
		name: string;
		teamSize: number;
	};
	participants: number;
	teams?: number;
}
