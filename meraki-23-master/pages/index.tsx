import React, { useEffect } from "react";
import styles from "@/styles/pages/Home.module.scss";
import { stylesConfig } from "@/utils/functions";
import {
	About,
	Account,
	Contact,
	Events,
	Hero,
	Sponsors,
} from "@/components/home";
import { getEvents } from "@/utils/api/events";
import { IEvent } from "@/types/event";
import useStore from "@/hooks/store";
import Navigation from "../components/Navigation";

interface HomePageProps {
	events: IEvent[];
}

const classes = stylesConfig(styles, "home");

const HomePage: React.FC<HomePageProps> = ({ events }) => {
	const { setEvents } = useStore();

	useEffect(() => {
		setEvents(events);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<main className={classes("")}>
			<Navigation />
			<Hero />
			<About />
			{events.length > 0 ? <Events events={events} /> : null}
			<Account />
			<Sponsors />
			<Contact />
		</main>
	);
};

export default HomePage;

export const getServerSideProps = async () => {
	try {
		const res = await getEvents();
		return {
			props: {
				events: res.data,
			},
		};
	} catch (error) {
		console.error(error);
		return {
			props: {
				events: [],
			},
		};
	}
};
