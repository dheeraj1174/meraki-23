import React, { useState, useEffect } from "react";
import Typography from "@/library/Typography";
import { PiCaretLeftBold } from "react-icons/pi";
import { AiOutlineDelete } from "react-icons/ai";
import useStore from "@/hooks/store";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { IEvent } from "@/types/event";
import { getEvent, updateEvent } from "@/utils/api/events";
import { Input, Textarea } from "@/library/form";
import regex from "@/constants/regex";
import Button from "@/library/Button";
import { defaultAvatar } from "@/constants/variables";
import Image from "next/image";
import {
	getParticipantsForEvent,
	removeParticipantFromEvent,
	approveParticipant as approveParticipantApi,
} from "@/utils/api/participation";
import {
	getTeamsForEvent,
	removeTeam as removeTeamApi,
} from "@/utils/api/teams";
import Member from "@/components/Member";
import Responsive from "@/layouts/Responsive";
import Loader from "@/components/Loader";
import { TEAM_PARTICIPATION_STATUS } from "@/constants/enum";
import { stylesConfig, switchDateFormat } from "@/utils/functions";
import styles from "@/styles/pages/admin/Event.module.scss";
import Footer from "@/components/Footer";

const classes = stylesConfig(styles, "admin-event");

const AdminEventPage: React.FC = () => {
	const router = useRouter();
	const { isCheckingLoggedIn, isLoggedIn } = useStore();
	const { slug } = router.query;
	const eventId = slug?.[0] as string;

	const dateKeys = [
		"registrationsStart",
		"registrationsEnd",
		"eventStart",
		"eventEnd",
	];

	const [gettingDetails, setGettingDetails] = useState(false);
	const [updatingDetails, setUpdatingDetails] = useState(false);
	const [gettingRegistrations, setGettingRegistrations] = useState(false);

	const [eventDetails, setEventDetails] = useState<Partial<IEvent>>({
		name: "",
		description: "",
		registrationsStart: "",
		registrationsEnd: "",
		eventStart: "",
		eventEnd: "",
		brochure: "",
		image: "",
		teamSize: 0,
	});
	const [poster, setPoster] = useState(eventDetails.image);
	const [registrations, setRegistrations] = useState<any[]>([]);

	const handleChange = (e: any) => {
		setEventDetails((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const parseDates = (
		obj: any,
		keys: string[],
		from: "utc" | "locale" = "utc",
		to: "utc" | "locale" = "locale"
	) => {
		const newObj = { ...obj };
		keys.forEach((key) => {
			if (newObj[key]) {
				newObj[key] = switchDateFormat(newObj[key], from, to);
			}
		});
		return newObj;
	};

	const getEventDetails = async () => {
		try {
			setGettingDetails(true);
			const res = await getEvent(eventId);
			const newEventDetails = parseDates(
				res.data,
				dateKeys,
				"utc",
				"locale"
			);
			setEventDetails(newEventDetails);
			setPoster(res.data.image);
		} catch (error: any) {
			console.error(error);
			toast.error(error.message ?? "Something went wrong");
			router.push("/admin");
		} finally {
			setGettingDetails(false);
		}
	};

	const updateEventDetails = async (e?: any) => {
		e?.preventDefault();
		try {
			setUpdatingDetails(true);
			const updatedEventDetails = parseDates(
				eventDetails,
				dateKeys,
				"locale",
				"utc"
			);
			const res = await updateEvent(eventId, updatedEventDetails);
			const newEventDetails = parseDates(
				res.data,
				dateKeys,
				"utc",
				"locale"
			);
			setEventDetails(newEventDetails);
			setPoster(res.data.image);
			toast.success(res.message);
		} catch (error: any) {
			console.error(error);
			toast.error(error.message ?? "Something went wrong");
		} finally {
			setUpdatingDetails(false);
		}
	};

	const getAllRegistrations = async () => {
		try {
			setGettingRegistrations(true);
			if (!eventDetails.teamSize) return;
			else if (eventDetails.teamSize === 1) {
				const res = await getParticipantsForEvent(eventId);
				setRegistrations(res.data);
			} else if (eventDetails.teamSize > 1) {
				const res = await getTeamsForEvent(eventId);
				setRegistrations(res.data);
			}
		} catch (error: any) {
			console.error(error);
			toast.error(error.message ?? "Something went wrong");
		} finally {
			setGettingRegistrations(false);
		}
	};

	const approveParticipant = async (participantId: string) => {
		try {
			const res = await approveParticipantApi(participantId);
			if (!eventDetails.teamSize) {
				toast.error("Something went wrong");
				return;
			} else if (eventDetails.teamSize === 1) {
				toast.error("Something went wrong");
				return;
			} else if (eventDetails.teamSize > 1) {
				const newRegistrations: any[] = registrations.map(
					(team: any) => {
						const newTeam = team;
						newTeam.participants = team.participants.map(
							(participant: any) => {
								if (participant._id === participantId) {
									return {
										...participant,
										status: TEAM_PARTICIPATION_STATUS.ACCEPTED,
									};
								}
								return participant;
							}
						);
						return newTeam;
					}
				);
				setRegistrations(newRegistrations);
			}
			return Promise.resolve(res.message ?? "Approved participant");
		} catch (error: any) {
			console.error(error);
			return Promise.reject(error.message ?? "Something went wrong");
		}
	};

	const removeParticipant = async (participantId: string) => {
		try {
			const res = await removeParticipantFromEvent(participantId);
			if (!eventDetails.teamSize) {
				toast.error("Something went wrong");
				return;
			} else if (eventDetails.teamSize === 1) {
				const newRegistrations = registrations.filter(
					(registration: any) => registration._id !== participantId
				);
				setRegistrations(newRegistrations);
			} else if (eventDetails.teamSize > 1) {
				const newRegistrations: any[] = registrations.map(
					(team: any) => {
						const newTeam = team;
						newTeam.participants = team.participants.filter(
							(participant: any) =>
								participant._id !== participantId
						);
						return newTeam;
					}
				);
				setRegistrations(newRegistrations);
			}
			return Promise.resolve(res.message ?? "Removed participant");
		} catch (error: any) {
			console.error(error);
			return Promise.reject(error.message ?? "Something went wrong");
		}
	};

	const removeTeam = async (teamId: string) => {
		try {
			const res = await removeTeamApi(teamId);
			if (!eventDetails.teamSize) {
				toast.error("Something went wrong");
				return;
			} else if (eventDetails.teamSize === 1) {
				toast.error("Something went wrong");
				return;
			} else if (eventDetails.teamSize > 1) {
				const newRegistrations = registrations.filter(
					(registration: any) => registration._id !== teamId
				);
				setRegistrations(newRegistrations);
			}
			return Promise.resolve(res.message ?? "Removed team");
		} catch (error: any) {
			console.error(error);
			return Promise.reject(error.message ?? "Something went wrong");
		}
	};

	useEffect(() => {
		if (isLoggedIn) getEventDetails();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isCheckingLoggedIn]);
	useEffect(() => {
		if (eventDetails.teamSize) getAllRegistrations();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventDetails]);

	return (
		<main className={classes("")}>
			{isCheckingLoggedIn || gettingDetails ? (
				<Loader />
			) : (
				<>
					<header className={classes("-header")}>
						<button
							className={classes("-header-back")}
							onClick={() => {
								router.push("/admin");
							}}
						>
							<PiCaretLeftBold />
						</button>
						<Typography
							type="heading"
							variant="display"
							className={classes("-heading")}
						>
							{eventDetails.name}
						</Typography>
					</header>
					<section className={classes("-details")}>
						<form
							className={classes("-details-form")}
							onSubmit={updateEventDetails}
						>
							<Input
								label="Event Name"
								name="name"
								value={eventDetails.name}
								type="text"
								onChange={handleChange}
								placeholder="Enter your name"
								error={eventDetails.name === ""}
								errorMessage="Name is required"
								required
								disabled
							/>
							<Textarea
								label="Event Description"
								name="description"
								id="description"
								rows={5}
								value={eventDetails.description}
								onChange={handleChange}
								placeholder="Enter event description"
								error={eventDetails.description === ""}
								errorMessage="Description is required"
								required
							/>
							<div className={classes("-details-form-group")}>
								<Input
									label="Registrations Start"
									name="registrationsStart"
									id="registrationsStart"
									value={eventDetails.registrationsStart}
									type="datetime-local"
									onChange={handleChange}
									placeholder="Enter Registrations Start"
									error={
										eventDetails.registrationsStart === ""
									}
									errorMessage="Registrations Start is required"
									required
								/>
								<Input
									label="Registrations End"
									name="registrationsEnd"
									id="registrationsEnd"
									value={eventDetails.registrationsEnd}
									type="datetime-local"
									onChange={handleChange}
									placeholder="Enter Registrations End"
									error={eventDetails.registrationsEnd === ""}
									errorMessage="Registrations End is required"
									required
								/>
							</div>
							<div className={classes("-details-form-group")}>
								<Input
									label="Event Start"
									name="eventStart"
									id="eventStart"
									value={eventDetails.eventStart}
									type="datetime-local"
									onChange={handleChange}
									placeholder="Enter Event Start"
									error={eventDetails.eventStart === ""}
									errorMessage="Event Start is required"
									required
								/>
								<Input
									label="Event End"
									name="eventEnd"
									id="eventEnd"
									value={eventDetails.eventEnd}
									type="datetime-local"
									onChange={handleChange}
									placeholder="Enter Event End"
									error={eventDetails.eventEnd === ""}
									errorMessage="Event End is required"
									required
								/>
							</div>
							<div className={classes("-details-form-group")}>
								<Input
									label="Event Brochure URL"
									name="brochure"
									id="brochure"
									value={eventDetails.brochure}
									type="url"
									onChange={handleChange}
									placeholder="Enter Brochure URL"
								/>
								<Input
									label="Event Poster Image URL"
									name="image"
									id="image"
									value={eventDetails.image}
									type="url"
									onChange={handleChange}
									placeholder="Enter Poster Image URL"
									pattern={regex.avatar.source}
									error={(() => {
										if (!eventDetails.image) return true;
										if (eventDetails.image === "")
											return true;
										if (
											!regex.avatar.test(
												eventDetails.image
											)
										)
											return true;
										return false;
									})()}
									errorMessage="Image URL is required and must be a valid image URL (jpeg, jpg, gif, png, webp)"
									required
								/>
							</div>
							<Input
								label="Team Size"
								name="teamSize"
								id="teamSize"
								value={eventDetails.teamSize}
								type="number"
								min={1}
								max={10}
								onChange={handleChange}
								placeholder="Enter Team Size"
								error={
									!eventDetails.teamSize
										? false
										: eventDetails.teamSize <= 0
								}
								errorMessage="Team Size is required"
								required
							/>
							<Button
								type="submit"
								variant="fill"
								size="small"
								loading={updatingDetails}
							>
								Update Event Details
							</Button>
						</form>
						<Image
							src={poster ?? defaultAvatar}
							alt={eventDetails.name ?? "Event Poster"}
							width={1920}
							height={1060}
							className={classes("-details-avatar")}
							onError={(e) => {
								e.currentTarget.src = defaultAvatar;
							}}
						/>
					</section>
					<hr className={classes("-divider")} />
					{gettingRegistrations ? (
						<Loader />
					) : (
						<section className={classes("-registrations")}>
							<div className={classes("-registrations-header")}>
								<Typography
									type="heading"
									variant="display"
									className={classes(
										"-registrations-heading"
									)}
								>
									Registrations
								</Typography>
							</div>
							{registrations.length === 0 ? (
								<Typography
									type="heading"
									variant="title-2"
									style={{
										margin: "auto",
										textAlign: "center",
									}}
								>
									No registrations yet
								</Typography>
							) : !eventDetails.teamSize ? (
								<Loader />
							) : eventDetails.teamSize === 1 ? (
								<Responsive.Row>
									{registrations.map((registration: any) => (
										<Responsive.Col
											key={registration._id}
											sm={100}
											md={50}
											lg={33}
											xlg={33}
										>
											<Member
												_id={registration._id}
												name={registration.name}
												email={registration.email}
												avatar={registration.avatar}
												onRemove={(id) => {
													toast.promise(
														removeParticipant(id),
														{
															loading:
																"Removing participant...",
															success: (
																message
															) => message,
															error: (message) =>
																message,
														}
													);
												}}
											/>
										</Responsive.Col>
									))}
								</Responsive.Row>
							) : (
								registrations.map((team: any) =>
									team.participants.length > 0 ? (
										<>
											<Typography
												type="heading"
												variant="title-2"
												className={classes(
													"-team-name"
												)}
											>
												{team.name} - (
												{team.participants.length}){" "}
												<AiOutlineDelete
													onClick={() => {
														toast.promise(
															removeTeam(
																team._id
															),
															{
																loading:
																	"Removing team...",
																success: (
																	message
																) => message,
																error: (
																	message
																) => message,
															}
														);
													}}
												/>
											</Typography>
											<Responsive.Row>
												{team.participants.map(
													(participant: any) => (
														<Responsive.Col
															key={
																participant._id
															}
															sm={100}
															md={50}
															lg={33}
															xlg={33}
														>
															<Member
																_id={
																	participant._id
																}
																name={
																	participant.name
																}
																email={
																	participant.email
																}
																avatar={
																	participant.avatar
																}
																status={(() => {
																	if (
																		team.createdBy ===
																		participant.userId
																	)
																		return "Team Leader";
																	else if (
																		participant.status ===
																		TEAM_PARTICIPATION_STATUS.ACCEPTED
																	)
																		return "Accepted";
																	else if (
																		participant.status ===
																		TEAM_PARTICIPATION_STATUS.PENDING
																	)
																		return "Confirmation Pending";
																	else if (
																		participant.status ===
																		TEAM_PARTICIPATION_STATUS.REJECTED
																	)
																		return "Rejected";
																	else
																		return "Unknown";
																})()}
																theme={(() => {
																	if (
																		team.createdBy ===
																		participant.userId
																	)
																		return "success";
																	else if (
																		participant.status ===
																		TEAM_PARTICIPATION_STATUS.ACCEPTED
																	)
																		return "success";
																	else if (
																		participant.status ===
																		TEAM_PARTICIPATION_STATUS.PENDING
																	)
																		return "warning";
																	else if (
																		participant.status ===
																		TEAM_PARTICIPATION_STATUS.REJECTED
																	)
																		return "danger";
																	else
																		return "info";
																})()}
																onApprove={(() => {
																	if (
																		team.createdBy ===
																			participant.userId ||
																		participant.status ===
																			TEAM_PARTICIPATION_STATUS.ACCEPTED
																	)
																		return undefined;
																	return (
																		id
																	) => {
																		toast.promise(
																			approveParticipant(
																				id
																			),
																			{
																				loading:
																					"Aproving participant...",
																				success:
																					(
																						message
																					) =>
																						message,
																				error: (
																					message
																				) =>
																					message,
																			}
																		);
																	};
																})()}
																onRemove={(() => {
																	if (
																		team.createdBy ===
																		participant.userId
																	)
																		return undefined;
																	return (
																		id
																	) => {
																		toast.promise(
																			removeParticipant(
																				id
																			),
																			{
																				loading:
																					"Removing participant...",
																				success:
																					(
																						message
																					) =>
																						message,
																				error: (
																					message
																				) =>
																					message,
																			}
																		);
																	};
																})()}
															/>
														</Responsive.Col>
													)
												)}
											</Responsive.Row>
										</>
									) : null
								)
							)}
						</section>
					)}
					<hr className={classes("-divider")} />
				</>
			)}
			<Footer />
		</main>
	);
};

export default AdminEventPage;
