import React from "react";
import { IEvent } from "@/types/event";
import Typography from "@/library/Typography";
import Button from "@/library/Button";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";
import { FiEye, FiTrash } from "react-icons/fi";
import { IoWarningOutline } from "react-icons/io5";
import { useConfirmationModal } from "@/components/Confirmation";

interface AdminDashboardEventCardProps extends IEvent {
	onDelete?: (_: string) => void;
}

const classes = stylesConfig(styles, "admin-event-card");

const AdminDashboardEventCard: React.FC<AdminDashboardEventCardProps> = ({
	_id,
	name,
	image,
	description,
	eventStart,
	onDelete,
}) => {
	const router = useRouter();

	const deleteEventConfirmation = useConfirmationModal(
		`Delete ${name}`,
		<>
			<Typography type="heading" variant="title-2">
				Are you sure you want to delete {name}?
			</Typography>
			<br />
			<Typography type="body" variant="medium">
				This will remove all the registrations and teams (if any)
				associated with this event.
			</Typography>
			<br />
			<Typography
				type="body"
				variant="extra-large"
				style={{
					color: "var(--red)",
					display: "flex",
					justifyContent: "flex-start",
					alignItems: "center",
					gap: "4px",
				}}
			>
				<IoWarningOutline />
				This action is irreversible.
			</Typography>
		</>,
		() => onDelete?.(_id),
		() => {}
	);

	return (
		<>
			<div
				key={_id}
				className={classes("")}
				style={{
					backgroundImage: `url(${image})`,
				}}
			>
				<Typography
					type="heading"
					variant="subtitle"
					className={classes("-title")}
				>
					{name}
				</Typography>
				<Typography
					type="heading"
					variant="title-3"
					className={classes("-date")}
				>
					{new Date(eventStart).toString().slice(0, 21)}
				</Typography>
				<Typography
					type="body"
					variant="large"
					className={classes("-description")}
				>
					{description.slice(0, 100)}...
				</Typography>
				<div className={classes("-buttons")}>
					<Button
						variant="light"
						onClick={() => {
							deleteEventConfirmation.openPopup();
						}}
						size="small"
						icon={<FiTrash />}
						iconPosition="left"
						className={classes("-button")}
					>
						Delete
					</Button>
					<Button
						variant="light"
						onClick={() => {
							router.push(`/admin/events/${_id}`);
						}}
						size="small"
						icon={<FiEye />}
						iconPosition="left"
						className={classes("-button")}
					>
						View/Edit
					</Button>
				</div>
			</div>
			{deleteEventConfirmation.showPopup
				? deleteEventConfirmation.Modal
				: null}
		</>
	);
};

export default AdminDashboardEventCard;
