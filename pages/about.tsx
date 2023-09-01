import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { stylesConfig } from "@/utils/functions";
import styles from "@/styles/pages/About.module.scss";
import { DotsSquare } from "@/assets/vectors/Dots";
import Typography from "@/library/Typography";
import Link from "next/link";

const classes = stylesConfig(styles, "about");

const AboutPage: React.FC = () => {
	const images = [
		"https://images.prismic.io/worldcoin-company-website/cfb5aaac-7497-4bb8-9890-ac4235a57520_what-is-a-hackathon%402x.jpg",
		"https://assetsio.reedpopcdn.com/race-clicker-codes.jpg",
		"https://e0.pxfuel.com/wallpapers/2/511/desktop-wallpaper-abstract-technical-ultra-tech.jpg",
		"https://sprinkdigital.com/blog/wp-content/uploads/2021/02/UI-UX.png",
	];
	const [slideImage, setSlideImage] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			setSlideImage(images[Math.floor(Math.random() * images.length)]);
		}, 5000);
		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<main className={classes("")}>
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
					style={{ backgroundImage: `url(${slideImage})` }}
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
