import React from "react";
import { Card, Hero } from "@/components/Team";
import people from "@/data/people";
import { stylesConfig } from "@/utils/functions";
import styles from "@/styles/pages/Team.module.scss";
import Responsive from "@/layouts/Responsive";
import { PERSON_ROLE } from "@/constants/enum";
import { DotsSquare } from "@/assets/vectors/Dots";

const classes = stylesConfig(styles, "team");

const TeamPage: React.FC = () => {
	return (
		<main className={classes("")}>
			<Hero />
			{Object.values(PERSON_ROLE).map((role, i) =>
				people.some((person) => person.role === role) ? (
					<React.Fragment key={`role-${role}-${i}`}>
						<h2 className={classes("-section__title")}>
							{(() => {
								switch (role) {
									case PERSON_ROLE.FACULTY_COORDINATOR:
										return "Faculty Coordinators";
									case PERSON_ROLE.STUDENT_COORDINATOR:
										return "Student Coordinators";
									case PERSON_ROLE.ALUMNI:
										return "Alumni Members";
									case PERSON_ROLE.DEVELOPMENT_TEAM:
										return "Development Team";
									default:
										return "Team";
								}
							})()}
							<DotsSquare />
						</h2>
						<div className={classes("-people")}>
							<Responsive.Row>
								{people
									.filter((person) => person.role === role)
									.map((person, i) => (
										<Responsive.Col
											key={`person-${i}`}
											xlg={33}
											lg={33}
											md={50}
											sm={100}
										>
											<Card {...person} />
										</Responsive.Col>
									))}
							</Responsive.Row>
						</div>
					</React.Fragment>
				) : null
			)}
		</main>
	);
};

export default TeamPage;
