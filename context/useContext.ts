import { useState } from "react";
import { IUser } from "@/types/auth";

const useContextData = () => {
	const [user, setUser] = useState<IUser | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [isCheckingLoggedIn, setIsCheckingLoggedIn] = useState<boolean>(true);

	const handleUser = (user: IUser | null) => {
		setUser(user);
		setIsCheckingLoggedIn(false);
	};

	const handleIsLoggedIn = (isLoggedIn: boolean) => {
		setIsLoggedIn(isLoggedIn);
		setIsCheckingLoggedIn(false);
	};

	const handleIsCheckingLoggedIn = (isCheckingLoggedIn: boolean) => {
		setIsCheckingLoggedIn(isCheckingLoggedIn);
	};

	const logout = () => {
		setUser(null);
		setIsLoggedIn(false);
		localStorage.removeItem("token");
	};

	return {
		user,
		setUser: handleUser,
		isLoggedIn,
		setIsLoggedIn: handleIsLoggedIn,
		isCheckingLoggedIn,
		setIsCheckingLoggedIn: handleIsCheckingLoggedIn,
		logout,
	};
};

export default useContextData;
