import { createContext } from "react";
import { IUser } from "@/types/auth";

const GlobalContext = createContext({
	user: null as IUser | null,
	setUser: (_: IUser | null) => {},
	isLoggedIn: false as boolean,
	setIsLoggedIn: (_: boolean) => {},
	isCheckingLoggedIn: false as boolean,
	setIsCheckingLoggedIn: (_: boolean) => {},
});

export default GlobalContext;
