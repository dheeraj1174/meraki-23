import Avatar from "@/components/Avatar";
import { defaultAvatar } from "@/constants/variables";
import useStore from "@/hooks/store";
import Button from "@/library/Button";
import Typography from "@/library/Typography";
import { Input } from "@/library/form";
import { IEvent } from "@/types/event";
import { patchUserDetails } from "@/utils/api/auth";
import { getEvents } from "@/utils/api/events";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { PiCaretLeftBold } from "react-icons/pi";
import { stylesConfig } from "@/utils/functions";
import styles from "@/styles/pages/admin/Dashboard.module.scss";
import Loader from "@/components/Loader";
import { FiLogOut } from "react-icons/fi";

const classes = stylesConfig(styles, "admin-dashboard");

const AdminDashboard: React.FC = () => {
	const router = useRouter();
	const { user, setUser, isCheckingLoggedIn, isLoggedIn, logout } =
		useStore();

	const [gettingEvents, setGettingEvents] = useState(false);
	const [updatingProfile, setUpdatingProfile] = useState(false);
	const [profileContents, setProfileContents] = useState({
		name: user?.name,
		email: user?.email,
		avatar: user?.avatar,
	});
	const [events, setEvents] = useState<IEvent[]>([]);

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

	const getAllEvents = async () => {
		try {
			setGettingEvents(true);
			const res = await getEvents();
			setEvents(res.data);
		} catch (error: any) {
			console.error(error);
			toast.error(error?.message ?? "Something went wrong");
		} finally {
			setGettingEvents(false);
		}
	};

	useEffect(() => {
		setProfileContents({
			name: user?.name,
			email: user?.email,
			avatar: user?.avatar,
		});
	}, [user]);

	useEffect(() => {
		getAllEvents();
	}, [isLoggedIn]);

	return (
		<main className={classes("")}>
			{isCheckingLoggedIn ? (
				<Loader />
			) : (
				<>
					<header className={classes("-header")}>
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
							Admin Dashboard
						</Typography>
						<Button
							icon={<FiLogOut />}
							variant="dark"
							size="small"
							onClick={logoutUser}
						>
							Logout
						</Button>
					</header>
					<section className={classes("-profile")}>
						<form
							className={classes("-profile-form")}
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
							alt={user?.name ?? ""}
							size={256}
							className={classes("-profile-avatar")}
						/>
					</section>
					<hr className={classes("-divider")} />
					<section className={classes("-events")}>
						<div className={classes("-events-header")}>
							<Typography
								type="heading"
								variant="display"
								className={classes("-events-heading")}
							>
								Events
							</Typography>
							<Button
								variant="dark"
								onClick={() => {
									router.push("/admin/events/new");
								}}
								size="medium"
							>
								Host a new event
							</Button>
						</div>
						<div className={classes("-events-all")}>
							{gettingEvents ? (
								<Loader />
							) : (
								events.map((event) => (
									<div
										key={event._id}
										className={classes("-events-card")}
										style={{
											backgroundImage: `url(${event.image})`,
										}}
									>
										<Typography
											type="heading"
											variant="subtitle"
											className={classes(
												"-events-card-title"
											)}
										>
											{event.name}
										</Typography>
										<Typography
											type="heading"
											variant="title-3"
											className={classes(
												"-events-card-date"
											)}
										>
											{new Date(
												event.date
											).toLocaleDateString()}
										</Typography>
										<Typography
											type="body"
											variant="large"
											className={classes(
												"-events-card-description"
											)}
										>
											{event.description.slice(0, 100)}...
										</Typography>
										<Button
											variant="light"
											onClick={() => {
												router.push(
													`/admin/events/${event._id}`
												);
											}}
											size="small"
											className={classes(
												"-events-card-button"
											)}
										>
											View/Edit
										</Button>
									</div>
								))
							)}
						</div>
					</section>
					<hr className={classes("-divider")} />
				</>
			)}
		</main>
	);
};

export default AdminDashboard;
