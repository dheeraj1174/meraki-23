import Avatar from "@/components/Avatar";
import { defaultAvatar } from "@/constants/variables";
import useStore from "@/hooks/store";
import Button from "@/library/Button";
import Typography from "@/library/Typography";
import { Input } from "@/library/form";
import styles from "@/styles/pages/admin/Dashboard.module.scss";
import { IEvent } from "@/types/event";
import { patchUserDetails } from "@/utils/api/auth";
import { getEvents } from "@/utils/api/events";
import { stylesConfig } from "@/utils/functions";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PiCaretLeftBold } from "react-icons/pi";
import sampleEvents from "@/data/events";

const classes = stylesConfig(styles, "admin-dashboard");

const AdminDashboard: React.FC = () => {
	const router = useRouter();
	const { user, setUser, isCheckingLoggedIn, isLoggedIn } = useStore();

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

	const getAllEvents = async () => {
		try {
			const res = await getEvents();
			setEvents(res.data);
			setEvents(sampleEvents); // TODO: Remove this line when API is ready
		} catch (error: any) {
			console.error(error);
			toast.error(error?.message ?? "Something went wrong");
		}
	};

	useEffect(() => {
		if (!isCheckingLoggedIn) {
			if (!isLoggedIn) {
				router.push(`/login?redirect=${router.asPath}`);
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

	useEffect(() => {
		getAllEvents();
	}, [isLoggedIn]);

	return (
		<main className={classes("")}>
			{isCheckingLoggedIn ? (
				<div className={classes("-loading")}>
					<AiOutlineLoading3Quarters
						className={classes("-loading-icon")}
					/>
				</div>
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
							{events.map((event) => (
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
										variant="title-3	"
										className={classes("-events-card-date")}
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
							))}
						</div>
					</section>
				</>
			)}
		</main>
	);
};

export default AdminDashboard;
