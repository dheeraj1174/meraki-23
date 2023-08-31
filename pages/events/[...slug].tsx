import React, { useState } from "react";
import Button from "@/library/Button";
import Typography from "@/library/Typography";
import { IEvent } from "@/types/event";
import { PiCaretLeftBold } from "react-icons/pi";
import { useRouter } from "next/router";
import EventPopup from "@/components/Event";
import useStore from "@/hooks/store";
import { getEvent } from "@/utils/api/events";
import { stylesConfig } from "@/utils/functions";
import styles from "@/styles/pages/Event.module.scss";

interface EventPageProps {
	event: IEvent;
}

const classes = stylesConfig(styles, "event");

const EventPage: React.FC<EventPageProps> = ({ event }) => {
	const router = useRouter();
	const { isLoggedIn } = useStore();
	const [showApplyPopup, setShowApplyPopup] = useState(false);

	if (!event) return null;
	return (
		<>
			<main
				className={classes("")}
				style={{
					backgroundImage: `url(${event.image})`,
				}}
				data-aos="zoom-in"
			>
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
						className={classes("-title")}
					>
						{event.name}
					</Typography>
				</div>
				<div className={classes("-body")}>
					<Typography
						type="body"
						variant="extra-large"
						className={classes("-description")}
					>
						{event.description}
					</Typography>
					<Typography
						type="body"
						variant="large"
						className={classes("-description")}
					>
						TeamSize: {event.teamSize}
					</Typography>
					{event.registrationsStart || event.registrationsEnd ? (
						<Typography
							type="body"
							variant="large"
							className={classes("-description")}
						>
							Registrations: {event.registrationsStart} -{" "}
							{event.registrationsEnd}
						</Typography>
					) : null}
					{event.eventStart || event.eventEnd ? (
						<Typography
							type="body"
							variant="large"
							className={classes("-description")}
						>
							Event timeline: {event.eventStart} -{" "}
							{event.eventEnd}
						</Typography>
					) : null}
					{event.brochure ? (
						<Button
							variant="light"
							onClick={() => {
								window.open(event.brochure, "_blank");
							}}
						>
							Event Brochure
						</Button>
					) : null}
				</div>
				<Button
					className={classes("-cta")}
					size="large"
					onClick={() => {
						if (isLoggedIn) setShowApplyPopup(true);
						else router.push(`/login?redirect=${router.asPath}`);
					}}
				>
					Register Now
				</Button>
			</main>
			{showApplyPopup ? (
				<EventPopup
					event={event}
					onClose={() => setShowApplyPopup(false)}
				/>
			) : null}
		</>
	);
};

export default EventPage;

export const getServerSideProps = async ({ params }: any) => {
	const { slug } = params;
	let [eventId] = slug;
	const res = await getEvent(eventId);
	try {
		return {
			props: {
				event: res.data,
			},
		};
	} catch (error) {
		console.error(error);
		return {
			redirect: {
				destination: "/404",
				permanent: false,
			},
		};
	}
};
