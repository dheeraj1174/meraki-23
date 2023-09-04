import React from "react";
import styles from "./styles.module.scss";
import { stylesConfig } from "@/utils/functions";
import Image from "next/image";

const classes = stylesConfig(styles, "home-hero");

const HomeHero: React.FC = () => {
	return (
		<section className={classes("")}>
			<div className={classes("-frame")} data-aos="zoom-in">
				<div className={classes("-frame--side", "-frame--front")}>
					<span className={classes("-subtitle")}>the</span>
					<span className={classes("-title")}>Meraki</span>
				</div>
				<div className={classes("-frame--side", "-frame--back")}>
					<Image
						src="/images/transparent-logo.png"
						alt="Meraki"
						width={400}
						height={400}
					/>
					<div className={classes("-content")}>
						<span className={classes("-content--title")}>
							Meraki - 2023
						</span>
						<span className={classes("-content--subtitle")}>
							Annual Tech Fest of IIIT Una
						</span>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HomeHero;
