import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { IoCloseSharp } from "react-icons/io5";
import images from "@/utils/gallery";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import useDevice from "@/hooks/device";

interface IGalleryFrame {
	index: number;
	onClose: () => void;
	onSelection: (_: number) => void;
}

const classes = stylesConfig(styles, "gallery-frame");

const GalleryFrame: React.FC<IGalleryFrame> = ({
	index,
	onClose,
	onSelection,
}) => {
	const frameRef = useRef<HTMLDivElement>(null);
	const { type: device } = useDevice();

	useEffect(() => {
		frameRef.current?.focus();
	}, []);

	return (
		<div
			className={classes("")}
			ref={frameRef}
			onKeyDown={(e) => {
				if (e.key === "Escape") {
					onClose();
				}
			}}
			tabIndex={0}
		>
			<button className={classes("-close")} onClick={onClose}>
				<IoCloseSharp />
			</button>
			<div className={classes("-image")}>
				<Image
					src={images[index]}
					alt="Gallery Image"
					width={window.innerWidth}
					height={window.innerHeight}
					data-aos="zoom-in"
				/>
			</div>
			<div className={classes("-tray")}>
				<button
					className={classes("-tray-button", "-tray-button--back")}
					onClick={() => {
						onSelection(Math.max(0, index - 1));
					}}
					disabled={index === 0}
				>
					<FaArrowUp />
				</button>
				{(() => {
					if (device === "mobile") {
						return images.slice(index, index + 1);
					} else
						return images.slice(
							Math.max(0, index - 1),
							Math.min(images.length, index + 2)
						);
				})().map((image, i) => (
					<div
						className={classes("-tray-item", {
							"-tray-item--active":
								images.indexOf(image) === index,
						})}
						key={`gallery-frame-${i}`}
						onClick={() => {
							onSelection(images.indexOf(image));
						}}
					>
						<Image
							src={image}
							alt="Gallery Image"
							width={256}
							height={256}
							data-aos="zoom-in"
						/>
					</div>
				))}

				<button
					className={classes("-tray-button", "-tray-button--forward")}
					onClick={() => {
						onSelection(Math.min(images.length - 1, index + 1));
					}}
					disabled={index === images.length - 1}
				>
					<FaArrowDown />
				</button>
			</div>
		</div>
	);
};

export default GalleryFrame;
