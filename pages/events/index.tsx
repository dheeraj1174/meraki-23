import React from "react";
import Typography from "@/library/Typography";
import { stylesConfig } from "@/utils/functions";
import { getEvents } from "@/utils/api/events";
import { IEvent } from "@/types/event";
import Events from "@/components/Events";
import styles from "@/styles/pages/Events.module.scss";

interface EventsPageProps {
	events: IEvent[];
}

const classes = stylesConfig(styles, "events");

const EventsPage: React.FC<EventsPageProps> = ({ events }) => {
	return (
		<main className={classes("")}>
			<Typography
				type="heading"
				variant="display"
				className={classes("-title")}
			>
				Events
			</Typography>
			<Events events={events} />
		</main>
	);
};

export default EventsPage;

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
