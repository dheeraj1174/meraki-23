import React from "react";
import styles from "./styles.module.scss";
import { stylesConfig } from "@/utils/functions";
import useStore from "@/hooks/store";
import Button from "@/library/Button";
import { USER_ROLES } from "@/constants/enum";
import Avatar from "@/components/Avatar";
import useDevice from "@/hooks/device";
import { useRouter } from "next/router";

const classes = stylesConfig(styles, "home-hero");

const HomeHero: React.FC = () => {
	const router = useRouter();
	const { events, user, isLoggedIn } = useStore();
	const { type: device } = useDevice();

	return (
		<section className={classes("")}>
			<header className={classes("-header")}>
				<Avatar
					src="/favicon-512.png"
					alt="Meraki IIITU Logo"
					size={device === "mobile" || device === "tablet" ? 48 : 64}
				/>
				<Button
					size={
						device === "mobile" || device === "tablet"
							? "small"
							: "medium"
					}
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
						: `Hii ${user?.name.split(" ")?.[0]} Visit Profile`}
				</Button>
			</header>
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
			<div className={classes("-content")}>
				Unleashing&nbsp;
				<span className={classes("-content__highlight")}>
					Innovation
				</span>
				: Where Tech Dreams Become Reality!
			</div>
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

export default HomeHero;
