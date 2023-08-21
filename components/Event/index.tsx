import React, { useState, useEffect } from "react";
import Popup from "@/library/Popup";
import { Input } from "@/library/form";
import { IEvent } from "@/types/event";
import { ITeam } from "@/types/team";
import sampleUsers from "@/data/users";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import ConfirmationModal from "../Confirmation";
import { toast } from "react-hot-toast";
import useStore from "@/hooks/store";

interface EventPopupProps {
	event: IEvent;
	onClose: () => void;
}

const classes = stylesConfig(styles, "event-popup");

const EventPopup: React.FC<EventPopupProps> = ({ event, onClose }) => {
	const { user } = useStore();
	const [registrationDetails, setRegistrationDetails] = useState({
		eventId: event._id,
		teamId: null,
	});

	const [teams, setTeams] = useState<ITeam[]>([]);

	const getTeams = async () => {
		try {
			setTeams([
				{
					_id: "1",
					name: "Team 1",
					event: event,
					createdBy: sampleUsers[0],
					members: [sampleUsers[0], sampleUsers[1]],
				},
			]);
		} catch (error) {
			console.error(error);
			setTeams([]);
		}
	};

	useEffect(() => {
		getTeams();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event._id]);

	return event.teamSize === 1 ? (
		<ConfirmationModal
			title="Register"
			body={`Participate in ${event.name} as ${user?.name}?`}
			onConfirm={() => {
				toast.success("Registered successfully!");
			}}
			onCancel={onClose}
		/>
	) : (
		<Popup
			onClose={onClose}
			title={`Register for ${event.name}`}
			width="60%"
			height="80%"
		>
			<form className={classes("-form")}>
				<Input
					label="Select a team"
					dropdown={{
						enabled: true,
						options: teams.map((team) => ({
							id: team._id,
							label: team.name,
							value: team._id,
						})),
						onSelect: (team) => {
							setRegistrationDetails({
								...registrationDetails,
								teamId: team.id,
							});
						},
					}}
					placeholder="Team Name"
				/>
			</form>
		</Popup>
	);
};

export default EventPopup;
