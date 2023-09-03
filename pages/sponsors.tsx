import React from "react";
import { stylesConfig } from "@/utils/functions";
import { DotsSquare } from "@/assets/vectors/Dots";
import Image from "next/image";
import sponsors from "@/constants/sponsors";
import styles from "@/styles/pages/Sponsors.module.scss";

const classes = stylesConfig(styles, "sponsosrs");

const SponsorsPage: React.FC = () => {
	return (
		<section className={classes("")} id="sponsors">
			<div className={classes("-container")}>
				<div className={classes("-left")}>
					{sponsors.map(({ logo: src, name, link }, i) => (
						<div
							className={classes("-sponsor")}
							key={`sponsor-${i}`}
							title={name}
						>
							<Image
								src={src}
								alt="sponsor"
								width={74}
								height={24}
								className={classes("-sponsor-img")}
								onClick={() => window.open(link, "_blank")}
							/>
						</div>
					))}
				</div>
				<div className={classes("-right")}>
					<h1 className={classes("-title")}>
						Our Sponsors
						<DotsSquare />
					</h1>
					<p className={classes("-description")}>
						We extend our sincere thanks to our sponsors, whose
						generous support fuels the success of MERAKI. We deeply
						appreciate their commitment to innovation and
						technology.
					</p>
				</div>
			</div>
			<div className={classes("-mesh")}>
				<div className={classes("-mesh-bottom")}></div>
			</div>
		</section>
	);
};

export default SponsorsPage;
