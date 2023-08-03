import React from "react";
import Typography from "@/library/Typography";
import { stylesConfig } from "@/utils/functions";
import sampleEvents from "@/data/events.json";
import { IEvent } from "@/types/Event";
import styles from "@/styles/pages/Event.module.scss";

interface EventPageProps {
	event: IEvent;
}

const classes = stylesConfig(styles, "event");

const EventPage: React.FC<EventPageProps> = ({ event }) => {
	if (!event) return null;
	return (
		<main
			className={classes("")}
			style={{
				backgroundImage: `url(${event.image})`,
			}}
			data-aos="zoom-in"
		>
			<Typography
				type="heading"
				variant="display"
				className={classes("-title")}
			>
				{event.name}
			</Typography>
		</main>
	);
};

export default EventPage;

export const getServerSideProps = async ({ params }: any) => {
	const { slug } = params;
	let [eventId] = slug;
	const event = sampleEvents.find((event) => event._id === eventId);
	if (!event) throw Error("Requested Event not a part of the fest");
	try {
		return {
			props: {
				event: event,
			},
		};
	} catch (error) {
		console.error(error);
		return {
			props: {
				event: null,
			},
		};
	}
};
