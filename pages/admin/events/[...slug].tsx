import React, { useState, useEffect } from "react";
import Typography from "@/library/Typography";
import { PiCaretLeftBold } from "react-icons/pi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useStore from "@/hooks/store";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { stylesConfig } from "@/utils/functions";
import styles from "@/styles/pages/admin/Event.module.scss";
import { IEvent } from "@/types/event";
import { getEvent, updateEvent } from "@/utils/api/events";
import { Input, Textarea } from "@/library/form";
import regex from "@/constants/regex";
import Button from "@/library/Button";
import { defaultAvatar } from "@/constants/variables";
import Image from "next/image";

const classes = stylesConfig(styles, "admin-event");

const AdminEventPage: React.FC = () => {
	const router = useRouter();
	const { isCheckingLoggedIn } = useStore();
	const { slug } = router.query;
	const eventId = slug?.[0] as string;

	const [gettingDetails, setGettingDetails] = useState(false);
	const [updatingDetails, setUpdatingDetails] = useState(false);
	const [eventDetails, setEventDetails] = useState<Partial<IEvent>>({
		name: "",
		description: "",
		date: "",
		image: "",
		teamSize: 0,
	});
	const [poster, setPoster] = useState(eventDetails.image);

	const handleChange = (e: any) => {
		setEventDetails((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const getEventDetails = async () => {
		try {
			setGettingDetails(true);
			const res = await getEvent(eventId);
			setEventDetails(res.data);
			setPoster(res.data.image);
		} catch (error: any) {
			console.log(error);
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
			const res = await updateEvent(eventId, eventDetails);
			setEventDetails(res.data);
			setPoster(res.data.image);
			toast.success(res.message);
		} catch (error: any) {
			console.log(error);
			toast.error(error.message ?? "Something went wrong");
		} finally {
			setUpdatingDetails(false);
		}
	};

	useEffect(() => {
		getEventDetails();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<main className={classes("")}>
			{isCheckingLoggedIn || gettingDetails ? (
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
							<Input
								label="Event Date"
								name="date"
								id="date"
								value={eventDetails.date}
								type="date"
								onChange={handleChange}
								placeholder="Select Event Date"
								required
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
									if (eventDetails.image === "") return true;
									if (!regex.avatar.test(eventDetails.image))
										return true;
									return false;
								})()}
								errorMessage="Image URL is required and must be a valid image URL (jpeg, jpg, gif, png, webp)"
								required
							/>
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
								variant="dark"
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
				</>
			)}
		</main>
	);
};

export default AdminEventPage;
