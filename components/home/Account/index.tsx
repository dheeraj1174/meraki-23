import React from "react";
import useStore from "@/hooks/store";
import Typography from "@/library/Typography";
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
			<div className={classes("-name")}>
				<Typography
					type="heading"
					variant="display"
					className={classes("-name__text")}
				>
					{isLoggedIn
						? `Hii, ${user?.name}`
						: "Envision the rise of bright tech"}
				</Typography>
			</div>
			{!isLoggedIn || !user ? (
				<Button
					onClick={() => {
						router.push("/login");
					}}
					variant="light"
					size="medium"
				>
					Join the hype
				</Button>
			) : user.role === USER_ROLES.ADMIN ? (
				<Button
					onClick={() => {
						router.push("/admin");
					}}
					variant="light"
					size="medium"
				>
					Go to your Dashboard
				</Button>
			) : (
				<Button
					onClick={() => {
						router.push("/profile");
					}}
					variant="light"
					size="medium"
				>
					Go to your Profile
				</Button>
			)}
		</section>
	);
};

export default HomeAccout;
