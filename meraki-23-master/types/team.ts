import { IEvent } from "./event";
import { IUser } from "./auth";

export interface ITeam {
	_id: string;
	name: string;
	event: IEvent;
	createdBy: IUser;
	members: IUser[];
}

export type TEAM_PARTICIPATION_STATUS = "accepted" | "pending" | "rejected";
