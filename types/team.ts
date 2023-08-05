import { IEvent } from "./Event";
import { IUser } from "./auth";

export interface ITeam {
	name: string;
	event: IEvent;
	createdBy: IUser;
}
