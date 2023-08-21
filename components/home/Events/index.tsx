import React from "react";
import styles from "./styles.module.scss";
import { stylesConfig } from "@/utils/functions";
import Events from "@/components/Events";
import Typography from "@/library/Typography";
import { IEvent } from "@/types/event";

interface HomeEventsProps {
	events: IEvent[];
}

const classes = stylesConfig(styles, "home-events");

const HomeEvents: React.FC<HomeEventsProps> = ({ events }) => {
	return (
		<section className={classes("")}>
			<Typography
				type="heading"
				variant="display"
				className={classes("-title")}
			>
				Events
			</Typography>
			<Events events={events} />
		</section>
	);
};

export default HomeEvents;
