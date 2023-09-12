import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { stylesConfig } from "@/utils/functions";
import styles from "@/styles/pages/Gallery.module.scss";
import { DotsSquare } from "@/assets/vectors/Dots";
import Typography from "@/library/Typography";
import useStore from "@/hooks/store";
import { IEvent } from "@/types/event";
import { useRouter } from "next/router";
import Masonry from "@/layouts/Masonry";
import Image from "next/image";
import images from "@/utils/gallery";
import GalleryFrame from "@/components/Gallery";
import Seo from "@/layouts/Seo";
import { frontendBaseUrl } from "@/constants/variables";

const classes = stylesConfig(styles, "gallery");

const GalleryPage: React.FC = () => {
	const router = useRouter();
	const { getEvents, events } = useStore();
	const [activeSlide, setActiveSlide] = useState<IEvent | null>(null);
	const [frame, setFrame] = useState(-1);
	const closeFrame = () => {
		setFrame(-1);
	};
	useEffect(() => {
		if (events.length === 0) getEvents();
		const interval = setInterval(() => {
			setActiveSlide(events[Math.floor(Math.random() * events.length)]);
		}, 5000);
		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Seo
				title="Gallery"
				description="Reach out to us at meraki@iiitu.ac.in"
				image="/favicon.png"
				canonical={frontendBaseUrl + "/gallery"}
				url={frontendBaseUrl + "/gallery"}
				twitter={{
					title: "Gallery",
					description: "Reach out to us at meraki@iiitu.ac.in",
					image: "/favicon.png",
					url: frontendBaseUrl + "/gallery",
				}}
				og={{
					title: "Gallery",
					description: "Reach out to us at meraki@iiitu.ac.in",
					images: [
						{
							url: "/favicon.png",
							secureUrl: "/favicon.png",
							type: "image/png",
							width: 512,
							height: 512,
							alt: "Gallery",
						},
					],
					url: frontendBaseUrl + "/gallery",
					type: "website",
					siteName: "Gallery",
				}}
			/>
			<main className={classes("")}>
				<Navbar />
				<section className={classes("-hero")}>
					<div className={classes("-content")}>
						<Typography
							type="heading"
							variant="display"
							className={classes("-content-title")}
						>
							Our Gallery
						</Typography>
						<Typography
							type="body"
							variant="extra-large"
							className={classes("-content-description")}
						>
							Explore the vibrant world of MERAKI through our
							gallery, where we capture the essence of our
							technical fest in vivid images. We hope these images
							give you a glimpse of the excitement that awaits you
							at MERAKI. Stay tuned for updates as we continue to
							add more moments to our gallery.
						</Typography>
					</div>
					<div className={classes("-right")}>
						<div
							className={classes("-slideshow")}
							style={{
								backgroundImage: `url(${
									activeSlide?.image ?? "/favicon.png"
								})`,
							}}
							title={activeSlide?.name}
							onClick={() =>
								router.push(`/events/${activeSlide?._id}`)
							}
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
				</section>
				<section className="-media">
					<Masonry xlg={4} lg={4} md={3} sm={2}>
						{images.map((image, index) => (
							<div
								className={classes("-media-item")}
								onClick={() => {
									setFrame(index);
								}}
								key={`gallery-image-${index}`}
							>
								<Image
									src={image}
									alt={image}
									width={500}
									height={500}
									className={classes("-media-item-image")}
								/>
							</div>
						))}
					</Masonry>
				</section>
			</main>

			{frame >= 0 ? (
				<GalleryFrame
					index={frame}
					onClose={closeFrame}
					onSelection={(i) => {
						setFrame(i);
					}}
				/>
			) : null}
		</>
	);
};

export default GalleryPage;
