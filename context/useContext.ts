import { useState } from "react";
import { IUser } from "@/types/auth";
import { IEvent } from "@/types/event";
import { getEvents } from "@/utils/api/events";

const useContextData = () => {
	const [user, setUser] = useState<IUser | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [isCheckingLoggedIn, setIsCheckingLoggedIn] = useState<boolean>(true);
	const [events, setEvents] = useState<IEvent[]>([]);

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

	const handleEvents = (events: IEvent[]) => {
		setEvents(events);
	};

	const fetchEvents = async () => {
		await getEvents()
			.then(({ data }) => {
				setEvents(data);
			})
			.catch((error) => {
				console.error(error);
			});
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
		events,
		setEvents: handleEvents,
		getEvents: fetchEvents,
		logout,
	};
};

export default useContextData;
