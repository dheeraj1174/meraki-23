import React from "react";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const classes = stylesConfig(styles, "loader");

const Loader: React.FC = () => (
	<div className={classes("")}>
		<AiOutlineLoading3Quarters className={classes("-loading-icon")} />
	</div>
);

export default Loader;
