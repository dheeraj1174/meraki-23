import React, { useState } from "react";
import { BsArrowDown, BsArrowRight } from "react-icons/bs";
import faqs from "@/constants/faqs";
import { stylesConfig } from "@/utils/functions";
import styles from "@/styles/pages/Faqs.module.scss";

const classes = stylesConfig(styles, "faqs");

const FaqsPage: React.FC = () => {
	const [active, setActive] = useState(-1);
	return (
		<main className={classes("")}>
			<div className="header"></div>
			<div className={classes("-container")}>
				<div className={classes("-accordion")}>
					{faqs.map((faq, index) => (
						<div
							className={classes("-accordion-item", {
								"-accordian-item--active": active === index,
							})}
							key={`faq-${index}`}
						>
							<div
								className={classes("-accordion-link")}
								id={`question-${index}`}
								onClick={() =>
									setActive((p) => (p === index ? -1 : index))
								}
							>
								<div className={classes("-flex")}>
									<h3>{faq.question}</h3>
								</div>
								{active === index ? (
									<BsArrowDown />
								) : (
									<BsArrowRight />
								)}
							</div>
							<div className={classes("-answer")}>
								<p>{faq.answer}</p>
							</div>
							<hr />
						</div>
					))}
				</div>
			</div>
		</main>
	);
};

export default FaqsPage;
