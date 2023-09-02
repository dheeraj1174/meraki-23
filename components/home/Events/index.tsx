import React from "react";
import styles from "./styles.module.scss";
import { stylesConfig } from "@/utils/functions";
import Events from "@/components/Events";
import { IEvent } from "@/types/event";

interface HomeEventsProps {
	events: IEvent[];
}

const classes = stylesConfig(styles, "home-events");

const HomeEvents: React.FC<HomeEventsProps> = ({ events }) => {
	return (
		<section className={classes("")}>
			<Events events={events} />
		</section>
	);
};

export default HomeEvents;
