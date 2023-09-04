import React from "react";
import useStore from "@/hooks/store";
import { USER_ROLES } from "@/constants/enum";
import Button from "@/library/Button";
import { useRouter } from "next/router";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";

const classes = stylesConfig(styles, "home-account");

const HomeAccout: React.FC = () => {
	const router = useRouter();
	const { user, isLoggedIn } = useStore();

	return (
		<section className={classes("")}>
			<div className={classes("-frame")} data-aos="zoom-in">
				<div className={classes("-eclipse")}>
					<div className={classes("-layer", "-layer-1")}></div>
					<div className={classes("-layer", "-layer-2")}></div>
					<div className={classes("-layer", "-layer-3")}></div>
					<div className={classes("-layer", "-layer-4")}></div>
					<div className={classes("-layer", "-layer-5")}></div>
					<div className={classes("-layer", "-layer-6")}></div>
				</div>
				<div className={classes("-container")}>
					<span className={classes("-title")}>Welcome to MERAKI</span>
					<span className={classes("-description")}>
						{isLoggedIn ? (
							<>
								Welcome back, {user?.name}! We&apos;re thrilled
								to see you again. Your journey with us
								continues, and we&apos;re here to make it even
								more rewarding.
							</>
						) : (
							<>
								By joining us, you gain access to event
								registration, exclusive content, and the
								opportunity to connect with fellow tech
								enthusiasts at MERAKI. Log in today and explore
								all the exciting features we have to offer.
							</>
						)}
					</span>
					<Button
						className={classes("-button")}
						variant="light"
						onClick={() => {
							if (!isLoggedIn) {
								router.push("/login");
							} else if (user?.role === USER_ROLES.ADMIN) {
								router.push("/admin");
							} else {
								router.push("/profile");
							}
						}}
					>
						{!isLoggedIn
							? "Join us Today!"
							: user?.role === USER_ROLES.ADMIN
							? "Go to Admin Dashboard"
							: "Visit your profile"}
					</Button>
				</div>
			</div>
		</section>
	);
};

export default HomeAccout;
