import React, { useState, useEffect } from "react";
import Popup from "@/library/Popup";
import { Input } from "@/library/form";
import { IEvent } from "@/types/Event";
import { ITeam } from "@/types/Team";
import sampleUsers from "@/data/users";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";

interface EventPopupProps {
	event: IEvent;
	onClose: () => void;
}

const classes = stylesConfig(styles, "event-popup");

const EventPopup: React.FC<EventPopupProps> = ({ event, onClose }) => {
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

	return (
		<Popup
			onClose={onClose}
			title={`Register for ${event.name}`}
			width="60%"
			height="80%"
		>
			{event.teamSize === 1 ? (
				<form className={classes("-form")}></form>
			) : (
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
			)}
		</Popup>
	);
};

export default EventPopup;
