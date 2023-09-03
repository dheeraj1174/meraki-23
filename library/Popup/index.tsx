import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Typography from "@/library/Typography";

interface PopupProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	title?: string;
	onClose: () => void;
	width?: number | string;
	height?: number | string;
	style?: React.CSSProperties;
}

const classes = stylesConfig(styles, "popup");

export const Popup: React.FC<PopupProps> = ({
	children,
	title,
	onClose,
	width = 500,
	height = 500,
	style,
	...props
}) => {
	const [isClosing, setIsClosing] = useState(false);
	const popupRef = useRef<HTMLDivElement>(null);

	const handleClose = () => {
		setIsClosing(true);
		setTimeout(() => {
			onClose && onClose();
		}, 150);
	};

	useEffect(() => {
		popupRef.current?.focus();
	}, []);

	return (
		<>
			<div
				className={classes("", {
					"--closing": isClosing,
				})}
				style={{
					width: `min(90%, ${width})`,
					height: `min(90%, ${height})`,
					...style,
				}}
				ref={popupRef}
				tabIndex={-1}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						handleClose();
					}
				}}
				{...props}
			>
				<div className={classes("-header")}>
					<Typography
						type="body"
						variant="extra-large"
						className={classes("-header-title")}
					>
						{title}
					</Typography>
					<button
						onClick={handleClose}
						className={classes("-header-close")}
					>
						<AiOutlineClose />
					</button>
				</div>
				<div className={classes("-body")}>{children}</div>
			</div>
			<div className={classes("-overlay")} onClick={handleClose}></div>
		</>
	);
};

export default Popup;
