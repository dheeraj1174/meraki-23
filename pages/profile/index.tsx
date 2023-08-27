import Avatar from "@/components/Avatar";
import Loader from "@/components/Loader";
import Member from "@/components/Member";
import { defaultAvatar } from "@/constants/variables";
import useStore from "@/hooks/store";
import Responsive from "@/layouts/Responsive";
import Button from "@/library/Button";
import Typography from "@/library/Typography";
import { Input } from "@/library/form";
import styles from "@/styles/pages/Profile.module.scss";
import { patchUserDetails } from "@/utils/api/auth";
import { getMyRegistrations } from "@/utils/api/users";
import { stylesConfig } from "@/utils/functions";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { PiCaretLeftBold } from "react-icons/pi";

const classes = stylesConfig(styles, "profile");

const ProfilePage: React.FC = () => {
	const router = useRouter();
	const { user, setUser, isCheckingLoggedIn, isLoggedIn } = useStore();

	const [updatingProfile, setUpdatingProfile] = useState(false);
	const [gettingRegistrations, setGettingRegistrations] = useState(false);
	const [profileContents, setProfileContents] = useState({
		name: user?.name,
		email: user?.email,
		avatar: user?.avatar,
	});
	const [registrations, setRegistrations] = useState<
		{
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
		}[]
	>([]);

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
							size={256}
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
				</>
			) : isCheckingLoggedIn ? (
				<Loader />
			) : null}
		</main>
	);
};

export default ProfilePage;
