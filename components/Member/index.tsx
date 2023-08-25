import React from "react";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import Avatar from "../Avatar";
import Typography from "@/library/Typography";

interface MemberProps {
	_id: string;
	name: string;
	email: string;
	avatar: string;
	status: string;
	onRemove?: (_: string) => void;
	onApprove?: (_: string) => void;
}

const classes = stylesConfig(styles, "member");

const Member: React.FC<MemberProps> = ({
	_id,
	name,
	email,
	avatar,
	onRemove,
	onApprove,
}) => {
	return (
		<div className={classes("")}>
			<div className={classes("-left")}>
				<Avatar src={avatar} alt={name} size="large" />
				<Typography type="heading" variant="title-1">
					{name}
				</Typography>
				<a href={`mailto:${email}`} className={classes("-email")}>
					<Typography type="body" variant="medium">
						{email}
					</Typography>
				</a>
			</div>
			<div className={classes("-right")}>
				{onApprove ? (
					<button
						className={classes("-btn", "-btn--success")}
						onClick={() => onApprove(_id)}
					>
						<Typography type="heading" variant="title-3">
							Approve
						</Typography>
					</button>
				) : null}
				{onRemove ? (
					<button
						className={classes("-btn", "-btn--danger")}
						onClick={() => onRemove(_id)}
					>
						<Typography type="heading" variant="title-3">
							Remove
						</Typography>
					</button>
				) : null}
			</div>
		</div>
	);
};

export default Member;
