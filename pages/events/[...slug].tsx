import React, { useState } from "react";
import Button from "@/library/Button";
import Typography from "@/library/Typography";
import sampleEvents from "@/data/events.json";
import { IEvent } from "@/types/Event";
import { stylesConfig } from "@/utils/functions";
import { PiCaretLeftBold } from "react-icons/pi";
import styles from "@/styles/pages/Event.module.scss";
import { useRouter } from "next/router";
import Popup from "@/library/Popup";
import { toast } from "react-hot-toast";

interface EventPageProps {
	event: IEvent;
}

const classes = stylesConfig(styles, "event");

const EventPage: React.FC<EventPageProps> = ({ event }) => {
	const router = useRouter();
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
							router.back();
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
				</div>
				<Button
					className={classes("-cta")}
					size="large"
					onClick={() => {
						toast.success("Applied");
						setShowApplyPopup(true);
					}}
				>
					Apply Now
				</Button>
			</main>
			{showApplyPopup ? (
				<Popup
					onClose={() => setShowApplyPopup(false)}
					title={`Apply for ${event.name}`}
					width="60%"
					height="80%"
				>
					<Typography type="heading" variant="subtitle">
						Apply for {event.name}
					</Typography>
				</Popup>
			) : null}
		</>
	);
};

export default EventPage;

export const getServerSideProps = async ({ params }: any) => {
	const { slug } = params;
	let [eventId] = slug;
	const event = sampleEvents.find((event) => event._id === eventId);
	if (!event) throw Error("Requested Event not a part of the fest");
	try {
		return {
			props: {
				event: event,
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
