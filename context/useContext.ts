import { useState } from "react";
import { IUser } from "@/types/auth";

const useContextData = () => {
	const [user, setUser] = useState<IUser | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

	const handleUser = (user: IUser | null) => {
		setUser(user);
	};

	const handleIsLoggedIn = (isLoggedIn: boolean) => {
		setIsLoggedIn(isLoggedIn);
	};

	return {
		user,
		setUser: handleUser,
		isLoggedIn,
		setIsLoggedIn: handleIsLoggedIn,
	};
};

export default useContextData;
