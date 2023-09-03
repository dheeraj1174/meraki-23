import Avatar from "@/components/Avatar";
import Loader from "@/components/Loader";
import Member from "@/components/Member";
import { TEAM_PARTICIPATION_STATUS } from "@/constants/enum";
import { defaultAvatar } from "@/constants/variables";
import useStore from "@/hooks/store";
import Responsive from "@/layouts/Responsive";
import Button from "@/library/Button";
import Typography from "@/library/Typography";
import { Input } from "@/library/form";
import { patchUserDetails } from "@/utils/api/auth";
import {
	removeParticipantFromEvent,
	approveParticipant as approveParticipantApi,
} from "@/utils/api/participation";
import { getMyRegistrations } from "@/utils/api/users";
import { removeTeam as removeTeamApi } from "@/utils/api/teams";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiLogOut } from "react-icons/fi";
import { PiCaretLeftBold } from "react-icons/pi";
import { AiOutlineDelete } from "react-icons/ai";
import Footer from "@/components/Footer";
import { stylesConfig } from "@/utils/functions";
import styles from "@/styles/pages/Profile.module.scss";
import useDevice from "@/hooks/device";

interface IRegistration {
	event: {
		id: string;
		name: string;
		teamSize: number | string;
	};
	participant?: {
		id: string;
		userId: string;
		name: string;
		email: string;
		avatar: string;
	};
	team?: {
		id: string;
		name: string;
		createdBy: string;
		members: {
			id: string;
			userId: string;
			name: string;
			email: string;
			avatar: string;
			status: string;
		}[];
	};
}

const classes = stylesConfig(styles, "profile");

const ProfilePage: React.FC = () => {
	const router = useRouter();
	const { type: device } = useDevice();
	const { user, setUser, isCheckingLoggedIn, isLoggedIn, logout } =
		useStore();

	const [updatingProfile, setUpdatingProfile] = useState(false);
	const [gettingRegistrations, setGettingRegistrations] = useState(false);
	const [profileContents, setProfileContents] = useState({
		name: user?.name,
		email: user?.email,
		avatar: user?.avatar,
	});
	const [registrations, setRegistrations] = useState<IRegistration[]>([]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProfileContents((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const updateProfile = async (e: any = undefined) => {
		e?.preventDefault();
		try {
			setUpdatingProfile(true);
			const body: any = { name: profileContents.name };
			if (
				profileContents.avatar &&
				profileContents.avatar !== defaultAvatar
			) {
				body.avatar = profileContents.avatar;
			}
			const res = await patchUserDetails(body);
			setUser({
				...user,
				...res.data,
			});
			toast.success("Profile updated");
		} catch (error: any) {
			console.error(error);
			toast.error(error?.message ?? "Something went wrong");
		} finally {
			setUpdatingProfile(false);
		}
	};

	const logoutUser = (e: any = undefined) => {
		e?.preventDefault();
		logout();
		router.push("/");
	};

	const getAllRegistrations = async () => {
		try {
			setGettingRegistrations(true);
			const res = await getMyRegistrations();
			setRegistrations(res.data);
		} catch (error: any) {
			console.error(error);
			toast.error(error?.message ?? "Something went wrong");
		} finally {
			setGettingRegistrations(false);
		}
	};

	const approveParticipant = async (
		teamSize: number,
		participantId: string
	) => {
		try {
			const res = await approveParticipantApi(participantId);
			if (!teamSize) {
				toast.error("Something went wrong");
				return;
			} else if (teamSize === 1) {
				toast.error("Something went wrong");
				return;
			} else if (teamSize > 1) {
				const newRegistrations: IRegistration[] = registrations.map(
					(team) => {
						const newTeam = team;
						newTeam.team?.members.forEach((member) => {
							if (member.id === participantId) {
								member.status =
									TEAM_PARTICIPATION_STATUS.ACCEPTED;
							}
						});
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

	const removeParticipant = async (
		teamSize: number,
		participantId: string
	) => {
		try {
			const res = await removeParticipantFromEvent(participantId);
			if (!teamSize) {
				toast.error("Something went wrong");
				return;
			} else if (teamSize === 1) {
				const newRegistrations: IRegistration[] = registrations.filter(
					(registration) =>
						registration.participant?.id !== participantId
				);
				setRegistrations(newRegistrations);
			} else if (teamSize > 1) {
				const newRegistrations: IRegistration[] = registrations.map(
					(team) => {
						const newTeam = team;
						if (newTeam.team?.members)
							newTeam.team.members = newTeam.team.members.filter(
								(member) => member.id !== participantId
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

	const removeTeam = async (teamSize: number, teamId: string) => {
		try {
			const res = await removeTeamApi(teamId);
			if (!teamSize) {
				toast.error("Something went wrong");
				return;
			} else if (teamSize === 1) {
				toast.error("Something went wrong");
				return;
			} else if (teamSize > 1) {
				const newRegistrations: IRegistration[] = registrations.filter(
					(registration) => registration.team?.id !== teamId
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
		if (!isCheckingLoggedIn) {
			if (!isLoggedIn) {
				router.push(`/login?redirect=${router.asPath}`);
			} else {
				getAllRegistrations();
			}
		}
	}, [isCheckingLoggedIn, isLoggedIn, router]);

	useEffect(() => {
		setProfileContents({
			name: user?.name,
			email: user?.email,
			avatar: user?.avatar,
		});
	}, [user]);

	return (
		<main className={classes("")}>
			<div className={classes("-header")}>
				<button
					className={classes("-header-back")}
					onClick={() => {
						router.push("/");
					}}
				>
					<PiCaretLeftBold />
				</button>
				<Typography
					type="heading"
					variant="display"
					className={classes("-heading")}
				>
					My Profile
				</Typography>
				<Button
					icon={<FiLogOut />}
					variant="dark"
					size="small"
					onClick={logoutUser}
				>
					Logout
				</Button>
			</div>
			{isLoggedIn && user ? (
				<>
					<section className={classes("-body")}>
						<form
							className={classes("-form")}
							onSubmit={updateProfile}
						>
							<Input
								label="Name"
								name="name"
								value={profileContents.name}
								type="text"
								onChange={handleChange}
								placeholder="Enter your name"
								error={profileContents.name === ""}
								errorMessage="Name is required"
								required
							/>
							<Input
								label="Email"
								name="email"
								value={profileContents.email}
								type="email"
								onChange={handleChange}
								placeholder="Enter your email"
								error={profileContents.email === ""}
								errorMessage="Email is required"
								required
								disabled
							/>
							<Input
								label="Avatar"
								name="avatar"
								value={
									profileContents.avatar === defaultAvatar
										? ""
										: profileContents.avatar
								}
								type="url"
								onChange={handleChange}
								title="Enter a valid image URL"
								placeholder="Enter your avatar URL"
								error={profileContents.avatar === ""}
								errorMessage="Enter a valid image URL"
							/>
							<Button
								variant="dark"
								loading={updatingProfile}
								type="submit"
							>
								Update Profile
							</Button>
						</form>
						<Avatar
							src={profileContents.avatar ?? defaultAvatar}
							alt={user?.name}
							size={device === "mobile" ? 128 : 256}
							className={classes("-avatar")}
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
							) : (
								registrations.map((registration) => {
									if (
										!registration.participant &&
										!registration.team?.members.some(
											(member) =>
												member.userId === user?._id
										)
									)
										return null;
									return (
										<div
											className={classes(
												"-registrations-card"
											)}
											key={registration.event.id}
										>
											<Typography
												type="heading"
												variant="title-1"
												className={classes(
													"-registrations-card-heading"
												)}
											>
												{registration.event.name}
											</Typography>
											{registration.event.teamSize ===
											1 ? (
												<Typography
													type="heading"
													variant="subtitle"
													className={classes(
														"-registrations-card-subheading"
													)}
												>
													Solo Event
												</Typography>
											) : (
												<>
													<Typography
														type="heading"
														variant="subtitle"
														className={classes(
															"-registrations-card-subheading"
														)}
													>
														Team Name:{" "}
														{
															registration.team
																?.name
														}
														{registration.team
															?.createdBy ===
														user?._id ? (
															<AiOutlineDelete
																onClick={() => {
																	toast.promise(
																		removeTeam(
																			+registration
																				.event
																				.teamSize,
																			registration
																				.team
																				?.id ??
																				""
																		),
																		{
																			loading:
																				"Removing team...",
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
																}}
															/>
														) : null}
													</Typography>
													<Typography
														type="heading"
														variant="subtitle"
														className={classes(
															"-registrations-card-subheading"
														)}
													>
														Max Team Size:{" "}
														{
															registration.event
																.teamSize
														}
													</Typography>
												</>
											)}
											<Responsive.Row>
												{registration.participant ? (
													<Responsive.Col
														sm={100}
														md={50}
														lg={33}
														xlg={33}
													>
														<Member
															_id={
																registration
																	.participant
																	.id
															}
															name={
																registration
																	.participant
																	.name
															}
															email={
																registration
																	.participant
																	.email
															}
															avatar={
																registration
																	.participant
																	.avatar
															}
															onRemove={() => {
																toast.promise(
																	removeParticipant(
																		+registration
																			.event
																			.teamSize,
																		registration
																			.participant
																			?.id as string
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
															}}
														/>
													</Responsive.Col>
												) : (
													registration.team?.members.map(
														(member) => {
															return (
																<Responsive.Col
																	sm={100}
																	md={50}
																	lg={33}
																	xlg={33}
																	key={
																		member.id
																	}
																>
																	<Member
																		_id={
																			member.id
																		}
																		name={
																			member.name
																		}
																		email={
																			member.email
																		}
																		avatar={
																			member.avatar
																		}
																		status={(() => {
																			if (
																				registration
																					.team
																					?.createdBy ===
																				member.userId
																			)
																				return "Team Leader";
																			else if (
																				member.status ===
																				TEAM_PARTICIPATION_STATUS.ACCEPTED
																			)
																				return "Accepted";
																			else if (
																				member.status ===
																				TEAM_PARTICIPATION_STATUS.PENDING
																			)
																				return "Confirmation Pending";
																			else if (
																				member.status ===
																				TEAM_PARTICIPATION_STATUS.REJECTED
																			)
																				return "Rejected";
																			else
																				return "Unknown";
																		})()}
																		theme={(() => {
																			if (
																				registration
																					.team
																					?.createdBy ===
																				member.userId
																			)
																				return "success";
																			else if (
																				member.status ===
																				TEAM_PARTICIPATION_STATUS.ACCEPTED
																			)
																				return "success";
																			else if (
																				member.status ===
																				TEAM_PARTICIPATION_STATUS.PENDING
																			)
																				return "warning";
																			else if (
																				member.status ===
																				TEAM_PARTICIPATION_STATUS.REJECTED
																			)
																				return "danger";
																			else
																				return "info";
																		})()}
																		onApprove={(() => {
																			if (
																				user?._id !==
																				registration
																					.team
																					?.createdBy
																			) {
																				return undefined;
																			}
																			if (
																				member.status ===
																				TEAM_PARTICIPATION_STATUS.ACCEPTED
																			) {
																				return undefined;
																			}
																			return () =>
																				toast.promise(
																					approveParticipant(
																						+registration
																							.event
																							.teamSize,
																						member.id
																					),
																					{
																						loading:
																							"Approving participant...",
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
																		})()}
																		onRemove={(() => {
																			if (
																				member.id ===
																				registration
																					.team
																					?.createdBy
																			) {
																				return undefined;
																			}
																			if (
																				user?._id !==
																					registration
																						.team
																						?.createdBy &&
																				user?._id !==
																					member.userId
																			) {
																				return undefined;
																			}
																			return () =>
																				toast.promise(
																					removeParticipant(
																						+registration
																							.event
																							.teamSize,
																						member.id
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
																		})()}
																	/>
																</Responsive.Col>
															);
														}
													)
												)}
											</Responsive.Row>
										</div>
									);
								})
							)}
						</section>
					)}
					<hr className={classes("-divider")} />
				</>
			) : isCheckingLoggedIn ? (
				<Loader />
			) : null}
			<Footer />
		</main>
	);
};

export default ProfilePage;
