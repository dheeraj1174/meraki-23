import React from "react";
import styles from "./styles.module.scss";
import { stylesConfig } from "@/utils/functions";
import useStore from "@/hooks/store";

const classes = stylesConfig(styles, "home-hero");

const HomeHero: React.FC = () => {
	const { events } = useStore();
	return (
		<section className={classes("")}>
			<div className={classes("-carousel")} data-aos="fade-left">
				{events.map((event) => (
					<div
						className={classes("-carousel__item")}
						key={`home-carousel-${event._id}`}
						style={{
							backgroundImage: `url(${event.image})`,
						}}
					></div>
				))}
			</div>
			<div className={classes("-content")} data-aos="fade-left">
				<span className={classes("-content__text")}>
					Unleashing&nbsp;
				</span>
				<span className={classes("-content__highlight")}>
					Innovation
				</span>
				<span className={classes("-content__text")}>
					: Where Tech Dreams Become Reality!
				</span>
			</div>
		</section>
	);
};

export default HomeHero;
