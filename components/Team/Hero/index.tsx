import React from "react";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";

const classes = stylesConfig(styles, "team-hero");

const TeamHero: React.FC = () => {
	return (
		<section className={classes("")}>
			<span className={classes("-title")}>Who we Are</span>
			<p className={classes("-description")}>
				At MERAKI, our success is driven by the dedicated individuals
				who work tirelessly behind the scenes. Each team member brings
				unique skills, enthusiasm, and dedication to MERAKI. Together,
				we are committed to delivering an unforgettable experience that
				celebrates technology, innovation, and community.Meet our
				passionate team members who have come together to make this
				event a reality!
			</p>
			<button
				className={classes("-button")}
				onClick={() => {
					window.scrollTo(0, window.innerHeight);
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="60"
					height="60"
					viewBox="0 0 60 60"
					fill="none"
				>
					<path
						d="M17.5 25L30 37.5L42.5 25"
						stroke="white"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		</section>
	);
};

export default TeamHero;
