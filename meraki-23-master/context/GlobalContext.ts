import { createContext } from "react";
import { IUser } from "@/types/auth";
import { IEvent } from "@/types/event";

const GlobalContext = createContext({
	user: null as IUser | null,
	setUser: (_: IUser | null) => {},
	isLoggedIn: false as boolean,
	setIsLoggedIn: (_: boolean) => {},
	isCheckingLoggedIn: false as boolean,
	setIsCheckingLoggedIn: (_: boolean) => {},
	events: [] as IEvent[],
	setEvents: (_: IEvent[]) => {},
	getEvents: () => {},
	logout: () => {},
});

export default GlobalContext;
