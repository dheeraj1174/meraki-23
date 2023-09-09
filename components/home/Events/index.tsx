import React, { useState } from "react";
import styles from "./styles.module.scss";
import { slugify, stylesConfig } from "@/utils/functions";
import { IEvent } from "@/types/event";
import Button from "@/library/Button";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";
import { useRouter } from "next/router";

interface HomeEventsProps {
	events: IEvent[];
}

const classes = stylesConfig(styles, "home-events");

const HomeEvents: React.FC<HomeEventsProps> = ({ events }) => {
	const [activeEvent, setActiveEvent] = useState<number>(0);
	const router = useRouter();

	return (
		<section className={classes("")}>
			<div className={classes("-header")}>
				<span className={classes("-label")}>
					<span className={classes("-label__index")}>02. &nbsp;</span>
					<span className={classes("-label__text")}>Events</span>
				</span>
				<Button
					className={classes("-action")}
					onClick={() => router.push("/events")}
				>
					Explore All Events
				</Button>
			</div>
			<div className={classes("-carousel")}>
				{(() => {
					let arr = [];
					if (activeEvent === 0) {
						arr[0] = events[events.length - 1];
						arr[1] = events[activeEvent];
						arr[2] = events[activeEvent + 1];
					} else if (activeEvent === events.length - 1) {
						arr[0] = events[activeEvent - 1];
						arr[1] = events[activeEvent];
						arr[2] = events[0];
					} else {
						arr[0] = events[activeEvent - 1];
						arr[1] = events[activeEvent];
						arr[2] = events[activeEvent + 1];
					}
					return arr;
				})().map((event) => (
					<div
						className={classes("-event", {
							"-event--active":
								events.indexOf(event) === activeEvent,
						})}
						key={`event-${event._id}`}
						style={{
							backgroundImage: `
									linear-gradient(
										to bottom,
										rgba(0, 0, 0, 0),
										rgba(0, 0, 0, 0.5)
									), url(${event.image})
								`,
						}}
					>
						<div className={classes("-event__content")}>
							<span className={classes("-event__title")}>
								{`${events.indexOf(event) + 1}. ${event.name}`}
							</span>
							<Button
								className={classes("-event__action")}
								size="small"
								onClick={() => {
									router.push(
										`/events/${event._id}/${slugify(
											event.name
										)}`
									);
								}}
							>
								View Details
							</Button>
						</div>
					</div>
				))}
			</div>
			<div className={classes("-buttons")}>
				<button
					className={classes("-btn")}
					onClick={() => {
						if (activeEvent - 1 < 0) {
							setActiveEvent(events.length - 1);
						} else {
							setActiveEvent(activeEvent - 1);
						}
					}}
				>
					<PiCaretLeftBold />
				</button>
				<button
					className={classes("-btn")}
					onClick={() => {
						if (activeEvent + 1 > events.length - 1) {
							setActiveEvent(0);
						} else {
							setActiveEvent(activeEvent + 1);
						}
					}}
				>
					<PiCaretRightBold />
				</button>
			</div>
		</section>
	);
};

export default HomeEvents;
