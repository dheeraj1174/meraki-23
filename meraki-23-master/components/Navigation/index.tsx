import React, { useEffect, useState } from "react";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import navLinks from "@/constants/navigation";
import Link from "next/link";

interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
	theme?: "light" | "dark";
}

const classes = stylesConfig(styles, "navigation");

const Navigation: React.FC<NavigationProps> = ({ theme = "light" }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	const midIndex = Math.floor(navLinks.length / 2) + 1;

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setIsClosing(true);
				setTimeout(() => {
					setIsOpen(false);
					setIsClosing(false);
				}, 250);
			}
		};

		if (isOpen) document.addEventListener("keydown", handleKeyDown);
		else document.removeEventListener("keydown", handleKeyDown);

		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen]);

	return (
		<>
			<button
				className={classes("-btn", `-btn-${theme}`, {
					"-btn--open": isOpen,
				})}
				onClick={() => {
					if (isOpen) {
						setIsClosing(true);
						setTimeout(() => {
							setIsOpen(false);
							setIsClosing(false);
						}, 250);
					} else setIsOpen(true);
				}}
			>
				<span />
			</button>
			{isOpen ? (
				<nav
					className={classes("-nav", `-nav-${theme}`, {
						"-nav--closing": isClosing,
					})}
				>
					<div className={classes("-nav-left")}>
						{navLinks.slice(0, midIndex).map((link, index) => (
							<Link
								href={link.path}
								className={classes("-link")}
								key={index}
								data-index={`0${index + 1}`}
							>
								{link.label}
							</Link>
						))}
					</div>
					<div className={classes("-nav-right")}>
						{navLinks
							.slice(midIndex, navLinks.length)
							.map((link, index) => (
								<Link
									href={link.path}
									className={classes("-link")}
									key={index}
									data-index={`0${index + midIndex + 1}`}
								>
									{link.label}
								</Link>
							))}
					</div>
				</nav>
			) : null}
		</>
	);
};

export default Navigation;
