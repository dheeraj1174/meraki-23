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
import { slugify, stylesConfig } from "@/utils/functions";
import styles from "@/styles/pages/Event.module.scss";
import Navigation from "@/components/Navigation";
import Seo from "@/layouts/Seo";
import { frontendBaseUrl } from "@/constants/variables";
import { USER_ROLES } from "@/constants/enum";
import { FaShieldAlt } from "react-icons/fa";

interface EventPageProps {
	event: IEvent;
}

const classes = stylesConfig(styles, "event");

const EventPage: React.FC<EventPageProps> = ({ event }) => {
	const router = useRouter();
	const { isLoggedIn, user } = useStore();
	const [showApplyPopup, setShowApplyPopup] = useState(false);

	if (!event) return null;
	return (
		<>
			<Seo
				title={event.name}
				description={event.description}
				image={event.image}
				canonical={
					frontendBaseUrl + router.asPath.split("?")[0].slice(1)
				}
				url={frontendBaseUrl + router.asPath}
				twitter={{
					title: event.name,
					description: event.description,
					image: event.image,
					url: frontendBaseUrl + router.asPath,
				}}
				og={{
					title: event.name,
					description: event.description,
					images: [
						{
							url: event.image,
							secureUrl: event.image,
							type: "image/jpeg",
							width: 1920,
							height: 1080,
							alt: event.name,
						},
					],
					url: frontendBaseUrl + router.asPath,
					type: "website",
					siteName: event.name,
				}}
			/>
			<Navigation />
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
						{isLoggedIn && user?.role === USER_ROLES.ADMIN ? (
							<button
								className={classes("-btn", "-btn--outlined")}
								onClick={() => {
									router.push(`/admin/events/${event._id}`);
								}}
							>
								<FaShieldAlt />
								Admin Controls
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
	const eventId = slug[0];
	try {
		const res = await getEvent(eventId);
		let returnOptions: any = {
			props: {
				event: JSON.parse(JSON.stringify(res.data)),
			},
		};
		if (slug[1] !== slugify(res.data.name)) {
			returnOptions.redirect = {
				destination: `/events/${eventId}/${slugify(res.data.name)}`,
				permanent: true,
			};
		}
		return returnOptions;
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
