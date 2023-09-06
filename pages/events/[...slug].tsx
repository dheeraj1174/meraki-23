import React, { useState } from "react";
import Image from "next/image";
import Typography from "@/library/Typography";
import { IEvent } from "@/types/event";
import { AiOutlineUser } from "react-icons/ai";
import { HiOutlineDownload } from "react-icons/hi";
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
			<main className={classes("")}>
				<Image
					src={event.image}
					alt={event.name}
					width={1920}
					height={1080}
					className={classes("-image")}
				/>
				<section className={classes("-content")}>
					<Typography
						type="heading"
						variant="display"
						className={classes("-title")}
					>
						{event.name}
					</Typography>
					<Typography
						type="body"
						variant="extra-large"
						className={classes("-description")}
					>
						{event.description}
					</Typography>
					<div className={classes("-actions")}>
						<button
							className={classes("-btn", "-btn--filled")}
							onClick={() => {
								if (isLoggedIn) setShowApplyPopup(true);
								else
									router.push(
										`/login?redirect=${router.asPath}`
									);
							}}
							disabled={
								new Date(event.registrationsEnd) < new Date() ||
								new Date(event.registrationsStart) > new Date()
							}
							title={(() => {
								if (
									new Date(event.registrationsEnd) <
										new Date() &&
									new Date(event.registrationsStart) <
										new Date()
								)
									return "Registrations closed";
								else if (
									new Date(event.registrationsStart) >
									new Date()
								)
									return "Registrations not yet open";
								else return "Register Now";
							})()}
						>
							<AiOutlineUser />
							Register Now
						</button>
						{event.brochure ? (
							<button
								className={classes("-btn", "-btn--outlined")}
								onClick={() => {
									window.open(event.brochure, "_blank");
								}}
							>
								<HiOutlineDownload />
								Event Brochure
							</button>
						) : null}
					</div>
					<div className={classes("-chips")}>
						<span className={classes("-chip")}>
							{event.teamSize > 1
								? `Team Size: ${event.teamSize}`
								: "Individual"}
						</span>
						{event.registrationsStart || event.registrationsEnd ? (
							<span className={classes("-chip")}>
								Registrations:{" "}
								{new Date(event.registrationsStart)
									.toString()
									.slice(0, 16)}
								{" - "}
								{new Date(event.registrationsEnd)
									.toString()
									.slice(0, 16)}
							</span>
						) : null}
						{event.eventStart || event.eventEnd ? (
							<span className={classes("-chip")}>
								Event timeline:{" "}
								{new Date(event.eventStart)
									.toString()
									.slice(0, 16)}
								{" - "}
								{new Date(event.eventEnd)
									.toString()
									.slice(0, 16)}
							</span>
						) : null}
					</div>
				</section>
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
