import React from "react";
import { stylesConfig } from "@/utils/functions";
import Avatar from "../Avatar";
import Typography from "@/library/Typography";
import { useConfirmationModal } from "../Confirmation";
import { FcCheckmark, FcEmptyTrash } from "react-icons/fc";
import styles from "./styles.module.scss";

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
	const removeConfirmation = useConfirmationModal(
		`Remove ${name}`,
		`Are you sure you want to remove ${name}?`,
		() => onRemove?.(_id),
		() => {}
	);
	const approveConfirmation = useConfirmationModal(
		`Approve ${name}`,
		`Are you sure you want to approve ${name}?`,
		() => onApprove?.(_id),
		() => {}
	);
	return (
		<>
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
							onClick={() => approveConfirmation.openPopup()}
						>
							<FcCheckmark />
							Approve
						</button>
					) : null}
					{onRemove ? (
						<button
							className={classes("-btn", "-btn--danger")}
							onClick={() => removeConfirmation.openPopup()}
						>
							<FcEmptyTrash />
							Remove
						</button>
					) : null}
				</div>
			</div>
			{removeConfirmation.showPopup ? removeConfirmation.Modal : null}
			{approveConfirmation.showPopup ? approveConfirmation.Modal : null}
		</>
	);
};

export default Member;
