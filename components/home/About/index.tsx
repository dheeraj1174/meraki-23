import React from "react";
import styles from "./styles.module.scss";
import { stylesConfig } from "@/utils/functions";
import Events from "@/components/Events";
import sampleEvents from "@/data/events.json";
import Typography from "@/library/Typography";

const classes = stylesConfig(styles, "home-about");

const HomeAbout: React.FC = () => {
	return (
		<section className={classes("")}>
			<Typography
				type="heading"
				variant="display"
				className={classes("-title")}
			>
				Events
			</Typography>
			<Events events={sampleEvents} />
		</section>
	);
};

export default HomeAbout;
