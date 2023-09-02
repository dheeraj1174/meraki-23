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
			<div className={classes("-frame")}>
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
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Ducimus molestiae labore sapiente corrupti explicabo
						minus illo fugit laudantium illum vitae nemo magnam,
						molestias voluptate cumque officiis ipsa ullam et
						placeat!
						<br />
						<br />
						{isLoggedIn ? (
							<>Hii {user?.name}</>
						) : (
							<>Join the Hype!</>
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
							? "Explore Admin Dashboard"
							: "Visit your profile"}
					</Button>
				</div>
			</div>
		</section>
	);
};

export default HomeAccout;
