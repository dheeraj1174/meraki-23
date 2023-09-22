import React from "react";
import { IPerson } from "@/types/people";
import TeamCardSocial from "./Social";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import Typography from "@/library/Typography";

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
		<div
			className={classes("")}
			style={{
				backgroundImage: `url(${image})`,
			}}
		>
			<Typography
				type="heading"
				variant="title-2"
				className={classes("-cover-name")}
				data-aos="fade-up"
			>
				{name}
			</Typography>
			<div className={classes("-content")}>
				<Typography
					type="heading"
					variant="title-2"
					className={classes("-name")}
					data-aos="fade-up"
				>
					{name}
				</Typography>
				<Typography
					type="body"
					variant="large"
					className={classes("-bio")}
					data-aos="fade-up"
				>
					{bio}
				</Typography>
				<div className={classes("-socials")} data-aos="fade-up">
					<TeamCardSocial
						twitter={twitter}
						instagram={instagram}
						linkedin={linkedin}
						email={email}
					/>
				</div>
			</div>
		</div>
	);
};

export default TeamCard;
