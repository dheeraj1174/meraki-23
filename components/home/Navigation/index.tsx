import React, { useEffect, useState } from "react";
import Typography from "@/library/Typography";
import styles from "./styles.module.scss";
import { stylesConfig } from "@/utils/functions";
import Link from "next/link";

interface IHomeHeroNavigationLink {
	label: string;
	path: string;
}

const classes = stylesConfig(styles, "home-hero-navigation");

const HomeHeroNavigationLink: React.FC<IHomeHeroNavigationLink> = ({
	label,
	path,
}) => (
	<Link href={path} className={classes("-link")}>
		<Typography
			type="heading"
			variant="display"
			className={classes("-link")}
		>
			{label}
		</Typography>
	</Link>
);

const HomeHeroNavigation: React.FC = () => {
	const navLinks: IHomeHeroNavigationLink[] = [
		{
			label: "Events",
			path: "/events",
		},
		{
			label: "Gallery",
			path: "/gallery",
		},
		{
			label: "About",
			path: "/about",
		},
		{
			label: "Brochure",
			path: "/events",
		},
		{
			label: "Sponsors",
			path: "/sponsors",
		},
		{
			label: "Team",
			path: "/team",
		},
		{
			label: "FAQs",
			path: "/faqs",
		},
		{
			label: "Contact Us",
			path: "/contact",
		},
	];

	const [isNavbarVisible, setIsNavbarVisible] = useState(true);
	const handleScroll = () => {
		const { scrollY, innerHeight } = window;
		if (scrollY < innerHeight / 2) {
			setIsNavbarVisible(true);
		} else {
			setIsNavbarVisible(false);
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll, {
			passive: true,
		});
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<nav className={classes("")}>
			<div
				className={classes("-top", "-left-top")}
				style={{
					top: isNavbarVisible ? "0" : "-100%",
				}}
			>
				<div className={classes("-left", "-top-left")}>
					{navLinks.slice(0, 2).map((link, index) => (
						<HomeHeroNavigationLink
							key={link.path + index}
							label={link.label}
							path={link.path}
						/>
					))}
				</div>
				<div className={classes("-right", "-top-right")}>
					{navLinks.slice(2, 4).map((link, index) => (
						<HomeHeroNavigationLink
							key={link.path + index}
							label={link.label}
							path={link.path}
						/>
					))}
				</div>
			</div>
			<div
				className={classes("-bottom", "-left-bottom")}
				style={{
					bottom: isNavbarVisible ? "0" : "-100%",
				}}
			>
				<div className={classes("-left", "-bottom-left")}>
					{navLinks.slice(4, 6).map((link, index) => (
						<HomeHeroNavigationLink
							key={link.path + index}
							label={link.label}
							path={link.path}
						/>
					))}
				</div>
				<div className={classes("-right", "-bottom-right")}>
					{navLinks.slice(6, 8).map((link, index) => (
						<HomeHeroNavigationLink
							key={link.path + index}
							label={link.label}
							path={link.path}
						/>
					))}
				</div>
			</div>
		</nav>
	);
};

export default HomeHeroNavigation;
