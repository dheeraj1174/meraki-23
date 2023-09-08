import React from "react";
import { stylesConfig } from "@/utils/functions";
import { DotsSquare } from "@/assets/vectors/Dots";
import Image from "next/image";
import sponsors from "@/constants/sponsors";
import Navigation from "@/components/Navigation";
import styles from "@/styles/pages/Sponsors.module.scss";

const classes = stylesConfig(styles, "sponsosrs");

const SponsorsPage: React.FC = () => {
	return (
		<main className={classes("")} id="sponsors">
			<Navigation />
			<div className={classes("-container")}>
				<div className={classes("-content")}>
					<h1 className={classes("-content__title")}>
						Our Sponsors
						<DotsSquare />
					</h1>
					<p className={classes("-content__description")}>
						We extend our sincere thanks to our sponsors, whose
						generous support fuels the success of MERAKI. We deeply
						appreciate their commitment to innovation and
						technology.
					</p>
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
			<div className={classes("-mesh")}>
				<div className={classes("-mesh-bottom")}></div>
			</div>
		</main>
	);
};

export default SponsorsPage;
