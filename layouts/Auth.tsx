import React, { useEffect } from "react";
import Avatar from "@/components/Avatar";
import { useRouter } from "next/router";
import useStore from "@/hooks/store";
import Typography from "@/library/Typography";
import styles from "@/styles/pages/Auth.module.scss";
import { stylesConfig } from "@/utils/functions";

const classes = stylesConfig(styles, "auth");

const AuthLayout: React.FC<{
	title: string;
	subtitle: string;
	children: any;
}> = ({ title, subtitle, children }) => {
	const router = useRouter();
	const { isCheckingLoggedIn, isLoggedIn } = useStore();

	useEffect(() => {
		if (!isCheckingLoggedIn && isLoggedIn)
			router.push(router.query.redirect?.toString() ?? "/");
	}, [isCheckingLoggedIn, isLoggedIn, router]);

	return (
		<main className={classes("")}>
			<section className={classes("-graphic")}>
				<Typography
					type="heading"
					variant="display"
					className={classes("-graphic__text")}
				>
					Meraki 23
					<br />
					Experience the wilderness of the web
				</Typography>
			</section>
			<section className={classes("-content")}>
				<div className={classes("-content-head")}>
					<h1 className={classes("-content-head__icon")}>
						<Avatar
							src="/favicon.png"
							alt="Meraki IIITU favicon"
							onClick={() => router.push("/")}
						/>
					</h1>
					<h1 className={classes("-content-head__title")}>{title}</h1>
					<h3 className={classes("-content-head__subtitle")}>
						{subtitle}
					</h3>
				</div>
				{children}
			</section>
		</main>
	);
};

export default AuthLayout;
