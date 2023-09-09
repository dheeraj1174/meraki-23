import React from "react";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import Image from "next/image";
import sponsors from "@/constants/sponsors";

const classes = stylesConfig(styles, "home-sponsosrs");

const HomeSponsors: React.FC = () => {
	return (
		<section className={classes("")} id="sponsors">
			<div className={classes("-header")}>
				<span className={classes("-label")}>
					<span className={classes("-label__index")}>04. &nbsp;</span>
					<span className={classes("-label__text")}>Sponsors</span>
				</span>
			</div>
			<div className={classes("-container")}>
				<div className={classes("-content")}>
					We extend our sincere thanks to our sponsors, whose generous
					support fuels the success of MERAKI. We deeply appreciate
					their commitment to innovation and technology.
				</div>
				<div className={classes("-logos")}>
					{sponsors.map(({ logo: src, name, link }, i) => (
						<div
							className={classes("-sponsor")}
							key={`sponsor-${i}`}
							title={name}
						>
							<Image
								src={src}
								alt="sponsor"
								width={512}
								height={512}
								className={classes("-sponsor-img")}
								onClick={() => window.open(link, "_blank")}
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default HomeSponsors;
