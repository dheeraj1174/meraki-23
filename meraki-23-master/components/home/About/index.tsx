import React from "react";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import Button from "@/library/Button";
import { useRouter } from "next/router";
import useDevice from "@/hooks/device";
import { AiOutlineFilePdf } from "react-icons/ai";

const classes = stylesConfig(styles, "home-about");

const HomeAbout: React.FC = () => {
	const router = useRouter();
	const { type: device } = useDevice();
	return (
		<section className={classes("")} id="about">
			<div className={classes("-header")}>
				<span className={classes("-label")}>
					<span className={classes("-label__index")}>01. &nbsp;</span>
					<span className={classes("-label__text")}>About</span>
				</span>
				<Button
					className={classes("-action")}
					onClick={() => router.push("/about")}
				>
					Know More About Us
				</Button>
			</div>
			<p className={classes("-body")}>
				Welcome to MERAKI: Where Creativity Meets Technology, the annual
				celebration of innovation, creativity, and technology at IIIT
				UNA. We are more than just a technical fest; we are a platform
				for dreamers, creators, and tech enthusiasts to come together
				and push the boundaries of possibility and shape their future.
			</p>
			<Button
				className={classes("-button")}
				size={device === "mobile" ? "small" : "medium"}
				onClick={() => {
					router.push("/brochure");
				}}
				icon={<AiOutlineFilePdf />}
				iconPosition="left"
			>
				Download Brochure
			</Button>
		</section>
	);
};

export default HomeAbout;
