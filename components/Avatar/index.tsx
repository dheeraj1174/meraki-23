import React, { useState } from "react";
import styles from "./styles.module.scss";
import { stylesConfig } from "@/utils/functions";
import Image from "next/image";
import Typography from "@/library/Typography";

interface IAvatarProps {
	src: string;
	alt: string;
	className?: string;
	onClick?: () => void;
	size?: "small" | "medium" | "large" | number;
}

const classes = stylesConfig(styles);

const Avatar: React.FC<IAvatarProps> = ({
	src,
	alt,
	className,
	onClick,
	size = "medium",
}) => {
	const [isImageValid, setIsImageValid] = useState(true);

	const getAvatarSize = () => {
		switch (size) {
			case "small":
				return 30;
			case "medium":
				return 50;
			case "large":
				return 100;
			default:
				return typeof size === "number" ? size : 50;
		}
	};

	return (
		<div
			className={classes("avatar", className)}
			onClick={onClick}
			style={{
				width: getAvatarSize(),
				height: getAvatarSize(),
				cursor:
					onClick && typeof onClick === "function"
						? "pointer"
						: "auto",
			}}
		>
			{isImageValid ? (
				<Image
					src={src}
					alt={alt + ""}
					width={getAvatarSize()}
					height={getAvatarSize()}
					className={classes("avatar-image")}
					onError={() => {
						setIsImageValid(false);
					}}
				/>
			) : (
				<div className={classes("avatar-placeholder")}>
					<Typography type="heading" variant="title-1">
						{alt ? alt[0] : "A"}
					</Typography>
				</div>
			)}
		</div>
	);
};

export default Avatar;
