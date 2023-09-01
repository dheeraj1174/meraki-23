import React from "react";
import styles from "./styles.module.scss";
import { stylesConfig } from "@/utils/functions";

const classes = stylesConfig(styles, "home-hero");

const HomeHero: React.FC = () => {
	return (
		<section className={classes("")}>
			<div className={classes("-frame")}>
				<span className={classes("-subtitle")}>the</span>
				<span className={classes("-title")}>Meraki</span>
			</div>
		</section>
	);
};

export default HomeHero;
