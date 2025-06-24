import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import React from "react";
const classes = stylesConfig(styles, "masonry");

interface IMasonry {
	sm?: number;
	md?: number;
	lg?: number;
	xlg?: number;
	children: React.ReactNode;
}

const Masonry: React.FC<IMasonry> = ({
	sm = 1,
	md = 2,
	lg = 3,
	xlg = 4,
	children,
}) => {
	return (
		<div
			className={classes(
				"",
				`-sm-${sm}`,
				`-md-${md}`,
				`-lg-${lg}`,
				`-xlg-${xlg}`
			)}
		>
			{React.Children.map(children, (child, index) => {
				return (
					<div className={classes("-item")} key={index}>
						{child}
					</div>
				);
			})}
		</div>
	);
};

export default Masonry;
