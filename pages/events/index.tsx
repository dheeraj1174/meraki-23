import React, { useEffect } from "react";
import Typography from "@/library/Typography";
import { slugify, stylesConfig } from "@/utils/functions";
import { getEvents } from "@/utils/api/events";
import { IEvent } from "@/types/event";
import styles from "@/styles/pages/Events.module.scss";
import useStore from "@/hooks/store";
import Button from "@/library/Button";
import Responsive from "@/layouts/Responsive";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/router";

interface EventsPageProps {
	events: IEvent[];
}

const classes = stylesConfig(styles, "events");

const EventsPage: React.FC<EventsPageProps> = ({ events }) => {
	const router = useRouter();
	const { setEvents } = useStore();

	useEffect(() => {
		setEvents(events);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<main className={classes("")}>
			<Navigation />
			<Typography
				type="heading"
				variant="display"
				className={classes("-title")}
			>
				Events
			</Typography>
			{events.length > 0 ? (
				<section className={classes("-section")}>
					<Responsive.Row>
						{events.map((event) => (
							<Responsive.Col
								key={event._id}
								sm={100}
								md={50}
								lg={33}
								xlg={33}
							>
								<div className={classes("-card")}>
									<div
										className={classes("-card-image")}
										style={{
											backgroundImage: `url(${event.image})`,
										}}
									/>
									<div className={classes("-card-content")}>
										<Typography
											type="heading"
											variant="title-1"
											className={classes("-card-title")}
										>
											{event.name}
										</Typography>
										<Typography
											type="body"
											variant="large"
											className={classes(
												"-card-description"
											)}
										>
											{event.description}
										</Typography>
										<Button
											variant="fill"
											className={classes("-card-button")}
											onClick={() => {
												router.push(
													`/events/${
														event._id
													}/${slugify(event.name)}`
												);
											}}
										>
											Join Event Now
										</Button>
									</div>
								</div>
							</Responsive.Col>
						))}
					</Responsive.Row>
				</section>
			) : (
				<Typography
					type="heading"
					variant="subtitle"
					className={classes("-title")}
				>
					No events found
				</Typography>
			)}
		</main>
	);
};

export default EventsPage;

export const getServerSideProps = async () => {
	try {
		const res = await getEvents();
		return {
			props: {
				events: res.data,
			},
		};
	} catch (error) {
		console.error(error);
		return {
			props: {
				events: [],
			},
		};
	}
};
