import React from "react";
import { stylesConfig } from "@/utils/functions";
import styles from "./styles.module.scss";
import { DotsSquare } from "@/assets/vectors/Dots";
import Image from "next/image";

const classes = stylesConfig(styles, "home-sponsosrs");

const HomeSponsors: React.FC = () => {
	return (
		<section className={classes("")} id="sponsors">
			<div className={classes("-container")}>
				<div className={classes("-left")}>
					{Array(6)
						.fill([
							"https://gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg",
							"https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
						])
						.flat()
						.map((src, i) => (
							<div
								className={classes("-sponsor")}
								key={`sponsor-${i}`}
							>
								<Image
									src={src}
									alt="sponsor"
									width={74}
									height={24}
									className={classes("-sponsor-img")}
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
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Doloremque provident cupiditate fuga, ullam earum
						voluptatibus obcaecati consectetur quidem soluta
						aspernatur repudiandae praesentium nobis maiores fugiat.
						Reiciendis blanditiis ea quisquam quia?
					</p>
				</div>
			</div>
			<div className={classes("-mesh")}>
				<div className={classes("-mesh-bottom")}></div>
			</div>
		</section>
	);
};

export default HomeSponsors;
