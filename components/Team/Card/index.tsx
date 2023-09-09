import React from "react";
import { IPerson } from "@/types/people";
import TeamCardSocial from "./Social";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";

const classes = stylesConfig(styles, "team-card");

interface TeamCardProps extends IPerson {}

const TeamCard: React.FC<TeamCardProps> = ({
	name,
	image,
	bio,
	twitter,
	linkedin,
	instagram,
	email,
}) => {
	return (
		<div className={classes("")}>
			<div
				className={classes("-front")}
				style={{
					backgroundImage: `
					    linear-gradient(
							to bottom,
							rgba(0, 0, 0, 0),
						    rgba(0, 0, 0, 0.5),
                            rgba(0, 0, 0, 0.8)
						), url(${image})
					`,
				}}
			>
				<span className={classes("-front-name")} data-aos="fade-up">
					{name}
				</span>
			</div>
			<div
				className={classes("-back")}
				style={{
					backgroundImage: `linear-gradient(
                    105deg,
                    rgba(0, 0, 0, 0.9) 0%,
                    rgba(0, 0, 0, 0.9) 60%,
                    transparent 50%
                ),
                url(${image})`,
				}}
			>
				<div className={classes("-back-content")}>
					<h3 className={classes("-name")}>{name}</h3>
					<p className={classes("-bio")}>{bio}</p>
					<div className={classes("-socials")}>
						<TeamCardSocial
							twitter={twitter}
							instagram={instagram}
							linkedin={linkedin}
							email={email}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TeamCard;
