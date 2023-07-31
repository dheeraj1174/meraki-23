import React from "react";
import styles from "@/styles/Home.module.scss";
import { stylesConfig } from "@/utils/functions";
import { About, Hero } from "@/components/home";

const classes = stylesConfig(styles, "home");

const HomePage: React.FC = () => {
	return (
		<main className={classes("")}>
			<Hero />
			<About />
		</main>
	);
};

export default HomePage;
