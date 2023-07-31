import React from "react";
import Typography from "@/library/Typography";
import styles from "./styles.module.scss";
import { stylesConfig } from "@/utils/functions";

const classes = stylesConfig(styles, "home-hero");

const HomeHero: React.FC = () => {
	return (
		<section className={classes("")}>
			<Typography
				type="heading"
				variant="display"
				className={classes("-title")}
			>
				Meraki
			</Typography>
		</section>
	);
};

export default HomeHero;
