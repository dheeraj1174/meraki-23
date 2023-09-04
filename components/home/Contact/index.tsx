import React from "react";
import styles from "./styles.module.scss";
import { stylesConfig } from "@/utils/functions";
import Button from "@/library/Button";
import { useRouter } from "next/router";

const classes = stylesConfig(styles, "home-contact");

const HomeContact: React.FC = () => {
	const router = useRouter();
	return (
		<section className={classes("")}>
			<div className={classes("-frame")} data-aos="zoom-in">
				<span className={classes("-title")}>Contact Us!</span>
				<span className={classes("-subtitle")}>
					Have questions or need assistance? We&apos;re here to help!
					Feel free to get in touch with us. We&apos;re eager to hear
					from you!
				</span>
				<Button
					variant="dark"
					className={classes("-button")}
					onClick={() => router.push("/contact")}
				>
					Contact Us
				</Button>
			</div>
		</section>
	);
};

export default HomeContact;
