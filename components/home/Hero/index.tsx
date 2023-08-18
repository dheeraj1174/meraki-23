import React from "react";
import { Navigation } from "..";
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
			<button
				className={classes("-btn")}
				type="button"
				onClick={() => {
					window.scroll(0, window.innerHeight);
				}}
			>
				<span className={classes("-btn-arrow")} />
			</button>
			<Navigation />
		</section>
	);
};

export default HomeHero;
