import { IEvent } from "./Event";
import { IUser } from "./auth";

export interface ITeam {
	_id: string;
	name: string;
	event: IEvent;
	createdBy: IUser;
	members: IUser[];
}
