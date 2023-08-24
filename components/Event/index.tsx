import React, { useState, useEffect } from "react";
import Popup from "@/library/Popup";
import { Input } from "@/library/form";
import { IEvent } from "@/types/event";
import { ITeam } from "@/types/team";
import ConfirmationModal from "../Confirmation";
import { toast } from "react-hot-toast";
import useStore from "@/hooks/store";
import {
	getTeams as getTeamsApi,
	createTeam as createTeamApi,
} from "@/utils/api/teams";
import { participateInEvent as participateInEventApi } from "@/utils/api/participation";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Button from "@/library/Button";

interface EventPopupProps {
	event: IEvent;
	onClose: () => void;
}

const classes = stylesConfig(styles, "event-popup");

const EventPopup: React.FC<EventPopupProps> = ({ event, onClose }) => {
	const { user } = useStore();

	const [gettingTeams, setGettingTeams] = useState(false);
	const [creatingTeam, setCreatingTeam] = useState(false);
	const [registering, setRegistering] = useState(false);
	const [isInputDisabled, setIsInputDisabled] = useState(false);
	const [registrationDetails, setRegistrationDetails] = useState({
		eventId: event._id,
		teamId: null,
	});
	const [newTeamName, setNewTeamName] = useState("");

	const [teams, setTeams] = useState<ITeam[]>([]);

	const getAllTeams = async () => {
		try {
			setGettingTeams(true);
			const res = await getTeamsApi();
			setTeams(res.data);
		} catch (error) {
			console.error(error);
			setTeams([]);
		} finally {
			setGettingTeams(false);
		}
	};

	const createTeamAndParticipate = async () => {
		try {
			setCreatingTeam(true);
			const res = await createTeamApi({
				name: newTeamName,
				event: event._id,
			});
			setTeams((prev) => [...prev, res.data]);
			setRegistrationDetails({
				...registrationDetails,
				teamId: res.data._id,
			});
			toast.success("Team created successfully!");
		} catch (error: any) {
			console.error(error);
			toast.error(error?.message ?? "Something went wrong");
			setIsInputDisabled(false);
		} finally {
			setCreatingTeam(false);
		}
	};

	const participateInOldTeam = async () => {
		try {
			setRegistering(true);
			if (!registrationDetails.teamId)
				throw Error("Team name is required");
			const res = await participateInEventApi(
				event._id,
				registrationDetails.teamId
			);
			toast.success(`Registered in ${res.data.team.name} successfully!`);
		} catch (error: any) {
			console.error(error);
			toast.error(error?.message ?? "Something went wrong");
			setIsInputDisabled(false);
		} finally {
			setRegistering(false);
		}
	};

	const participateAsIndividual = async () => {
		try {
			setRegistering(true);
			const res = await participateInEventApi(event._id);
			toast.success(`You have registered in ${res.data.event.name}`);
		} catch (error: any) {
			console.error(error);
			toast.error(error?.message ?? "Something went wrong");
			setIsInputDisabled(false);
		} finally {
			setRegistering(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsInputDisabled(true);
		if (newTeamName) {
			await createTeamAndParticipate();
		} else {
			await participateInOldTeam();
		}
	};

	useEffect(() => {
		getAllTeams();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [event._id]);

	return event.teamSize === 1 ? (
		<ConfirmationModal
			title="Register"
			body={`Participate in ${event.name} as ${user?.name}?`}
			onConfirm={() => {
				participateAsIndividual();
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
			{gettingTeams ? (
				<div className={classes("-loading")}>
					<AiOutlineLoading3Quarters
						className={classes("-loading-icon")}
					/>
				</div>
			) : (
				<>
					<form className={classes("-form")} onSubmit={handleSubmit}>
						{teams.length > 0 ? (
							<>
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
									value={
										teams.find(
											(team) =>
												team._id ===
												registrationDetails.teamId
										)?.name ?? ""
									}
									disabled={isInputDisabled}
								/>
								<div className={classes("-form-divider")}>
									<span>OR</span>
								</div>
							</>
						) : null}
						<Input
							label="Create your own team"
							name="teamName"
							value={newTeamName}
							type="text"
							onChange={(e: any) => {
								setNewTeamName(e.target.value);
							}}
							placeholder="Enter your team name"
							disabled={isInputDisabled}
						/>
						<Button
							type="submit"
							variant="dark"
							size="small"
							loading={creatingTeam || registering}
						>
							{newTeamName
								? "Create Team and Register"
								: "Register"}
						</Button>
					</form>
				</>
			)}
		</Popup>
	);
};

export default EventPopup;
