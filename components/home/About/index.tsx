import React from "react";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import Button from "@/library/Button";
import { useRouter } from "next/router";

const classes = stylesConfig(styles, "home-about");

const HomeAbout: React.FC = () => {
	const router = useRouter();
	return (
		<section className={classes("")} id="about">
			<span className={classes("-title")}>About Us</span>
			<p className={classes("-body")}>
				Welcome to MERAKI: Where Creativity Meets Technology, the annual
				celebration of innovation, creativity, and technology at IIIT
				UNA. We are more than just a technical fest; we are a platform
				for dreamers, creators, and tech enthusiasts to come together
				and push the boundaries of possibility and shape their future.
			</p>
			<div className={classes("-buttons")}>
				<Button
					className={classes("-button")}
					onClick={() => {
						router.push("/about");
					}}
				>
					Know More
				</Button>
				<Button
					className={classes("-button")}
					onClick={() => {
						router.push("/brochure");
					}}
				>
					Download Brochure
				</Button>
			</div>
		</section>
	);
};

export default HomeAbout;
