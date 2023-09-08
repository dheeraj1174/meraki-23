import React from "react";
import styles from "@/styles/pages/Team.module.scss";
import { stylesConfig } from "@/utils/functions";
import { Hero } from "@/components/Team";

const classes = stylesConfig(styles, "team");

const TeamPage: React.FC = () => {
	return (
		<main className={classes("")}>
			<Hero />
		</main>
	);
};

export default TeamPage;
