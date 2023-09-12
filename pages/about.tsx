import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { stylesConfig } from "@/utils/functions";
import styles from "@/styles/pages/About.module.scss";
import { DotsSquare } from "@/assets/vectors/Dots";
import Typography from "@/library/Typography";
import Link from "next/link";
import useStore from "@/hooks/store";
import { IEvent } from "@/types/event";
import { useRouter } from "next/router";
import Seo from "@/layouts/Seo";
import { frontendBaseUrl } from "@/constants/variables";

const classes = stylesConfig(styles, "about");

const AboutPage: React.FC = () => {
	const router = useRouter();
	const { getEvents, events } = useStore();
	const [activeSlide, setActiveSlide] = useState<IEvent | null>(null);

	useEffect(() => {
		if (events.length === 0) getEvents();
		const interval = setInterval(() => {
			setActiveSlide(events[Math.floor(Math.random() * events.length)]);
		}, 5000);
		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<main className={classes("")}>
			<Seo
				title="About Us"
				description="Welcome to MERAKI: Where Creativity Meets Technology, the annual celebration of innovation, creativity, and technology at IIIT UNA. We are more than just a technical fest; we are a platform for dreamers, creators, and tech enthusiasts to come together and push the boundaries of possibility and shape their future."
				image="/favicon.png"
				canonical={frontendBaseUrl + router.asPath}
				url={frontendBaseUrl + router.asPath}
				twitter={{
					title: "About Us",
					description:
						"Welcome to MERAKI: Where Creativity Meets Technology, the annual celebration of innovation, creativity, and technology at IIIT UNA. We are more than just a technical fest; we are a platform for dreamers, creators, and tech enthusiasts to come together and push the boundaries of possibility and shape their future.",
					image: "/favicon.png",
					url: frontendBaseUrl + router.asPath,
				}}
				og={{
					title: "About Us",
					description:
						"Welcome to MERAKI: Where Creativity Meets Technology, the annual celebration of innovation, creativity, and technology at IIIT UNA. We are more than just a technical fest; we are a platform for dreamers, creators, and tech enthusiasts to come together and push the boundaries of possibility and shape their future.",
					images: [
						{
							url: "/favicon.png",
							secureUrl: "/favicon.png",
							type: "image/png",
							width: 512,
							height: 512,
							alt: "About Us",
						},
					],
					url: frontendBaseUrl + router.asPath,
					type: "website",
					siteName: "About Us",
				}}
			/>
			<Navbar />
			<main className={classes("-container")}>
				<div className={classes("-content")}>
					<Typography
						type="heading"
						variant="display"
						className={classes("-content-title")}
					>
						About Us
					</Typography>
					<Typography
						type="body"
						variant="extra-large"
						className={classes("-content-description")}
					>
						Welcome to MERAKI: Where Creativity Meets Technology,
						the annual celebration of innovation, creativity, and
						technology at IIIT UNA. We are more than just a
						technical fest; we are a platform for dreamers,
						creators, and tech enthusiasts to come together and push
						the boundaries of possibility and shape their future.
					</Typography>
				</div>
				<div className={classes("-content")}>
					<Typography
						type="heading"
						variant="title-1"
						className={classes("-content-title")}
					>
						Our Vision
					</Typography>
					<Typography
						type="body"
						variant="extra-large"
						className={classes("-content-description")}
					>
						At MERAKI, we envision a future where innovation knows
						no bounds. Our mission is to nurture and inspire the
						next generation of tech leaders and pioneers. We believe
						in empowering individuals to transform their ideas into
						tangible, groundbreaking projects.
					</Typography>
				</div>
				<div className={classes("-content")}>
					<Typography
						type="heading"
						variant="title-1"
						className={classes("-content-title")}
					>
						What Sets Us Apart
					</Typography>
					<Typography
						type="body"
						variant="extra-large"
						className={classes("-content-description")}
					>
						<u>Diverse Tracks</u>: MERAKI encompasses a wide array
						of technical domains, from coding challenges that push
						your limits to hands-on hardware experiences that bridge
						the digital and physical worlds.
						<br />
						<br />
						<u>Inclusivity</u>: We welcome participants from all
						backgrounds and experience levels. Whether you&apos;re a
						seasoned coder or just taking your first steps into the
						world of technology, there&apos;s a place for you at
						MERAKI.
						<br />
						<br />
						<u>Innovation Showcase</u>: MERAKI is not just about
						learning; it&apos;s about creating. Showcase your
						innovative projects and ideas to a diverse audience,
						including potential collaborators and employers
					</Typography>
				</div>
				<div className={classes("-content")}>
					<Typography
						type="heading"
						variant="title-1"
						className={classes("-content-title")}
					>
						Join MERAKI: The Concept
					</Typography>
					<Typography
						type="body"
						variant="extra-large"
						className={classes("-content-description")}
					>
						MERAKI is not just an event; it&apos;s a concept.
						It&apos;s a chance for you to be a part of something
						bigger, to explore your passion for technology, and to
						make lasting connections with fellow innovators. Join us
						on this exciting journey of discovery, innovation, and
						transformation. Together, let&apos;s redefine
						what&apos;s possible
					</Typography>
				</div>
				<div className={classes("-content")}>
					<Typography
						type="heading"
						variant="title-1"
						className={classes("-content-title")}
					>
						Couldn&apos;t find what you&apos;re looking for?
					</Typography>
					<Typography
						type="body"
						variant="extra-large"
						className={classes("-content-description")}
					>
						Have questions or need assistance? We&apos;re here to
						help! Feel free to get in touch with us. Don&apos;t
						hesitate to reach out if you have inquiries about event
						registration, sponsorship opportunities, or any other
						fest-related matters. We&apos;re eager to hear from you
						and be a part of your MERAKI experience!
					</Typography>
					<Typography
						type="heading"
						variant="title-1"
						className={classes("-content-title")}
					>
						Useful Links
					</Typography>
					<Link href="/events">
						<Typography
							type="body"
							variant="extra-large"
							format="underlined"
							className={classes("-content-description")}
						>
							Events
						</Typography>
					</Link>
					<Link href="/faqs">
						<Typography
							type="body"
							variant="extra-large"
							format="underlined"
							className={classes("-content-description")}
						>
							FAQs
						</Typography>
					</Link>
					<Link href="/contact">
						<Typography
							type="body"
							variant="extra-large"
							format="underlined"
							className={classes("-content-description")}
						>
							Contact Us
						</Typography>
					</Link>
				</div>
			</main>
			<div className={classes("-right")}>
				<div
					className={classes("-slideshow")}
					style={{
						backgroundImage: `url(${
							activeSlide?.image ?? "/favicon.png"
						})`,
					}}
					title={activeSlide?.name}
					onClick={() => router.push(`/events/${activeSlide?._id}`)}
				>
					<span></span>
					<span></span>
					<span></span>
					<DotsSquare
						fill="var(--white)"
						className={classes("-right-dots")}
					/>
					<span></span>
				</div>
			</div>
		</main>
	);
};

export default AboutPage;
