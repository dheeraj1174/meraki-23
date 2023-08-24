import regex from "@/constants/regex";
import useStore from "@/hooks/store";
import Button from "@/library/Button";
import Typography from "@/library/Typography";
import { Input, Textarea } from "@/library/form";
import { createEvent } from "@/utils/api/events";
import { createEventValidator } from "@/validations/event";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PiCaretLeftBold } from "react-icons/pi";
import { stylesConfig } from "@/utils/functions";
import styles from "@/styles/pages/admin/Event.module.scss";

const classes = stylesConfig(styles, "admin-event-new");

const AdminNewEventPage: React.FC = () => {
	const router = useRouter();
	const { isCheckingLoggedIn } = useStore();

	const [creating, setCreating] = useState(false);
	const [eventDetails, setEventDetails] = useState({
		name: "",
		description: "",
		date: "",
		image: "",
		teamSize: 1,
	});

	const handleChange = (e: any) => {
		setEventDetails((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e?: any) => {
		e?.preventDefault();
		const avatarInput: any = document.querySelector("input#image");
		const val = avatarInput?.value;
		if (val && !regex.avatar.test(val)) {
			avatarInput?.setCustomValidity("Invalid image URL");
			e.target.reportValidity();
			return;
		}
		try {
			await createEventValidator({
				...eventDetails,
				teamSize: `${eventDetails.teamSize}`,
			}).catch((errors) => {
				e.target.reportValidity();
				throw new Error(
					errors.map((err: any) => err.message).join(", ")
				);
			});
			setCreating(true);
			const res = await createEvent(eventDetails);
			toast.success(res.message);
			router.push("/admin");
		} catch (error: any) {
			console.error(error);
			toast.error(error?.message ?? "Something went wrong");
		} finally {
			setCreating(false);
		}
	};

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
							Host a new Event
						</Typography>
					</header>
					<form className={classes("-form")} onSubmit={handleSubmit}>
						<Input
							label="Event Name"
							name="name"
							id="name"
							value={eventDetails.name}
							type="text"
							onChange={handleChange}
							placeholder="Enter event name"
							error={eventDetails.name === ""}
							errorMessage="Name is required"
							required
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
							error={
								eventDetails.image === "" ||
								!regex.avatar.test(eventDetails.image)
							}
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
							error={eventDetails.teamSize <= 0}
							errorMessage="Team Size is required"
							required
						/>
						<Button
							type="submit"
							variant="dark"
							size="small"
							loading={creating}
						>
							Host Event
						</Button>
					</form>
				</>
			)}
		</main>
	);
};

export default AdminNewEventPage;
