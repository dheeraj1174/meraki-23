import { slugify, stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import React, { useEffect, useState } from "react";
import { Event } from "@/types/Event";
import Link from "next/link";
import Typography from "@/library/Typography";

interface EventsProps {
	onClose?: any;
	events: Event[];
}

const classes = stylesConfig(styles, "events");

const Events: React.FC<EventsProps> = ({ onClose, events }) => {
	const [isClosing, setIsClosing] = useState(false);

	useEffect(() => {
		const handleClose = (e: KeyboardEvent) => {
			if (e.key === "Escape" && onClose) {
				setIsClosing(true);
				setTimeout(() => {
					onClose();
				}, 300);
			}
		};
		window.addEventListener("keydown", handleClose);
		return () => {
			window.removeEventListener("keydown", handleClose);
		};
	}, [onClose]);

	return (
		<section
			className={classes("", {
				"-closing": isClosing,
			})}
		>
			<div className={classes("-container")}>
				{events.map((event, index) => {
					return (
						<Link
							href={`/event/${event._id}/${slugify(event.name)}`}
							key={index}
							className={classes("-event")}
							style={{
								width: "300px",
								transform: `rotateY(calc(${index} * 45deg)) translateZ(400px)`,
								backgroundImage: `url(${event.image})`,
							}}
						>
							<Typography
								type="heading"
								variant="subtitle"
								className={classes("-event-title")}
							>
								{event.name}
							</Typography>
						</Link>
					);
				})}
			</div>
		</section>
	);
};

export default Events;
