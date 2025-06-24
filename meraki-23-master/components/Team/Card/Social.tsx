import React from "react";
import styles from "./styles.module.scss";
import { stylesConfig } from "@/utils/functions";
import { FiInstagram, FiLinkedin, FiMail, FiTwitter } from "react-icons/fi";

const classes = stylesConfig(styles, "team-card-social");

interface TeamCardSocialProps {
	twitter?: string;
	linkedin?: string;
	instagram?: string;
	email?: string;
}

const TeamCardSocial: React.FC<TeamCardSocialProps> = ({
	twitter,
	linkedin,
	instagram,
	email,
}) => {
	/* let handle = (() => {
		if (twitter) {
			return {
				href: twitter,
				icon: <FiTwitter />,
			};
		} else if (instagram) {
			return {
				href: instagram,
				icon: <FiInstagram />,
			};
		} else if (linkedin) {
			return {
				href: linkedin,
				icon: <FiLinkedin />,
			};
		} else if (email) {
			return {
				href: `mailto:${email}`,
				icon: <FiMail />,
			};
		} else {
			return null;
		}
	})();
    if (!handle) return null; */
	let handles = [];
	if (email) {
		handles.push({
			label: email,
			href: `mailto:${email}`,
			icon: <FiMail />,
		});
	}
	if (twitter) {
		handles.push({
			label: twitter.replace(/(https?:\/\/)?(www\.)?/i, ""),
			href: twitter,
			icon: <FiTwitter />,
		});
	}
	if (instagram) {
		handles.push({
			label: instagram.replace(/(https?:\/\/)?(www\.)?/i, ""),
			href: instagram,
			icon: <FiInstagram />,
		});
	}
	if (linkedin) {
		handles.push({
			label: linkedin.replace(/(https?:\/\/)?(www\.)?/i, ""),
			href: linkedin,
			icon: <FiLinkedin />,
		});
	}
	return (
		<>
			{handles.map((handle, index) => (
				<a
					key={`${handle.label}-${index}`}
					href={handle.href}
					target="_blank"
					rel="noopener noreferrer"
					className={classes("")}
					title={handle.href
						.replace(/(https?:\/\/)?(www\.)?/i, "")
						.replace(/\/$/, "")}
				>
					{handle.icon}
				</a>
			))}
		</>
	);
	/* return (
		<a
			href={handle.href}
			target="_blank"
			rel="noopener noreferrer"
			className={classes("")}
		>
			{handle.icon}
			<span className={classes("-text")}>
				{handle.href
					.replace(/(https?:\/\/)?(www\.)?/i, "")
					.replace(/\/$/, "")}
			</span>
		</a>
	); */
};

export default TeamCardSocial;
