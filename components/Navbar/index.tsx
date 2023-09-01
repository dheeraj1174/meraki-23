import React, { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import navLinks from "@/constants/navigation";
import { MdOutlineUnfoldLess, MdOutlineUnfoldMore } from "react-icons/md";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import { useOnClickOutside } from "@/hooks/mouse-events";

const classes = stylesConfig(styles, "header");

interface INavBarMenuProps extends React.AllHTMLAttributes<HTMLElement> {
	links?: {
		icon: any;
		path: string;
		label: string;
	}[];
	styles?: {
		btn?: React.CSSProperties;
		list?: React.CSSProperties;
		listItem?: React.CSSProperties;
	};
	theme?: "light" | "dark";
}

interface NavbarProps extends React.AllHTMLAttributes<HTMLElement> {}

export const NavBarMenu: React.FC<INavBarMenuProps> = ({
	links = navLinks,
	className,
	styles,
	theme = "dark",
	...props
}) => {
	const router = useRouter();
	const [activeRoute, setActiveRoute] = useState(router.pathname);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef<HTMLUListElement>(null);

	useOnClickOutside(menuRef, () => setIsMenuOpen(false));

	return (
		<nav
			className={classes("-nav", `-nav--${theme}`) + ` ${className}`}
			{...props}
			onKeyDown={(e) => {
				if (e.key === "Escape") {
					setIsMenuOpen(false);
				}
			}}
		>
			<button
				className={classes("-nav-btn")}
				onClick={() => setIsMenuOpen((prev) => !prev)}
				style={styles?.btn}
			>
				<span className={classes("-nav-btn-text")}>
					{links.find((link) => link.path === activeRoute)?.label}
				</span>
				{isMenuOpen ? <MdOutlineUnfoldLess /> : <MdOutlineUnfoldMore />}
			</button>
			{isMenuOpen ? (
				<ul
					className={classes("-nav-list")}
					ref={menuRef}
					style={styles?.list}
				>
					{links.map((link) => (
						<li
							key={link.path}
							className={classes("-nav-list-item")}
							onClick={() => {
								router.push(link.path);
								setActiveRoute(link.path);
								setIsMenuOpen(false);
							}}
							style={styles?.listItem}
						>
							{link.icon}
							{link.label}
						</li>
					))}
				</ul>
			) : null}
		</nav>
	);
};

const Navbar: React.FC<NavbarProps> = ({ className, ...props }) => {
	const router = useRouter();
	return (
		<header className={classes("") + ` ${className}`} {...props}>
			<NavBarMenu />
			<Image
				src="/favicon.png"
				alt="favicon"
				width={64}
				height={64}
				onClick={() => router.push("/")}
				className={classes("-logo")}
			/>
		</header>
	);
};

export default Navbar;
