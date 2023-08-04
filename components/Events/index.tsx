import { slugify, stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import React, { useEffect, useState } from "react";
import { IEvent } from "@/types/Event";
import Link from "next/link";
import Typography from "@/library/Typography";
import { useRouter } from "next/router";

interface EventsProps {
	onClose?: any;
	events: IEvent[];
}

const classes = stylesConfig(styles, "events");

const Events: React.FC<EventsProps> = ({ onClose, events }) => {
	const router = useRouter();
	const [isClosing, setIsClosing] = useState(false);
	const [transform, setTransform] = useState<string | null>(null);

	const animationStart = () => {
		setTransform("translate(0, 0)");
	};

	const animationEnd = () => {
		setTransform("translate(0, 0)");
	};

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

	useEffect(() => {
		router.events.on("routeChangeStart", animationStart);
		router.events.on("routeChangeComplete", animationEnd);
		return () => {
			router.events.off("routeChangeStart", animationStart);
			router.events.off("routeChangeComplete", animationEnd);
		};
	}, [router]);

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
							href={`/events/${event._id}/${slugify(event.name)}`}
							key={index}
							className={classes("-event")}
							style={{
								width: "300px",
								transform:
									transform ??
									`rotateY(calc(${index} * 45deg)) translateZ(400px)`,
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
