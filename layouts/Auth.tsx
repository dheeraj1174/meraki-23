import React, { useEffect } from "react";
import Avatar from "@/components/Avatar";
import { useRouter } from "next/router";
import useStore from "@/hooks/store";
import Typography from "@/library/Typography";
import styles from "@/styles/pages/Auth.module.scss";
import { stylesConfig } from "@/utils/functions";
import Seo from "./Seo";
import { frontendBaseUrl } from "@/constants/variables";

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
			<Seo
				title="Meraki 23"
				description="Reach out to us at meraki@iiitu.ac.in"
				image="/favicon.png"
				canonical={frontendBaseUrl + router.asPath}
				url={frontendBaseUrl + router.asPath}
				twitter={{
					title: "Meraki 23",
					description: "Reach out to us at meraki@iiitu.ac.in",
					image: "/favicon.png",
					url: frontendBaseUrl + router.asPath,
				}}
				og={{
					title: "Meraki 23",
					description: "Reach out to us at meraki@iiitu.ac.in",
					images: [
						{
							url: "/favicon.png",
							secureUrl: "/favicon.png",
							type: "image/png",
							width: 512,
							height: 512,
							alt: "Meraki 23",
						},
					],
					url: frontendBaseUrl + router.asPath,
					type: "website",
					siteName: "Meraki 23",
				}}
			/>
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
