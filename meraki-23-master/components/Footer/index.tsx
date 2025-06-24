import React from "react";
import Image from "next/image";
import socials from "@/constants/socials";
import navLinks from "@/constants/navigation";
import Link from "next/link";
import Typography from "@/library/Typography";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const classes = stylesConfig(styles, "footer");

const Footer: React.FC<FooterProps> = ({ className = "", ...props }) => {
	const router = useRouter();
	return (
		<footer className={classes("") + ` ${className}`} {...props}>
			<div className={classes("-top")}>
				<h1 className={classes("-top-heading")}>Connect with us</h1>
			</div>
			<div className={classes("-mid")}>
				<div className={classes("-mid-left")}>
					<Image
						src="/images/transparent-logo.png"
						alt="favicon"
						width={512}
						height={512}
					/>
				</div>
				<div className={classes("-mid-right")}>
					<div className={classes("-mid-block")}>
						<Typography
							type="heading"
							variant="title-2"
							className={classes("-mid-block--heading")}
						>
							Explore
						</Typography>
						<div className={classes("-mid-block--body")}>
							{navLinks
								.filter((obj) => obj.path !== router.pathname)
								.map((link, index) => (
									<Link
										href={link.path}
										key={index}
										className={classes("-mid-block--link")}
									>
										{link.icon}
										<span>{link.label}</span>
									</Link>
								))}
						</div>
					</div>
					<div className={classes("-mid-block")}>
						<Typography
							type="heading"
							variant="title-2"
							className={classes("-mid-block--heading")}
						>
							Reach Out to Us
						</Typography>
						<div className={classes("-mid-block--body")}>
							{socials.map((social, index) => (
								<a
									href={social.url}
									className={classes("-link")}
									target="_blank"
									rel="noopener noreferrer"
									title={social.name}
									key={index}
								>
									{social.icon}
								</a>
							))}
						</div>
					</div>
				</div>
			</div>
			<div className={classes("-bottom")}>
				<span className={classes("-bottom-left")}>
					Made with ❤ by Development Team
				</span>
				<div className={classes("-bottom-right")}>
					Meraki IIIT Una - 2023
				</div>
			</div>
		</footer>
	);
};

export default Footer;
