import React, { useState } from "react";
import Image from "next/image";
import Typography from "@/library/Typography";
import socials from "@/constants/socials";
import { toast } from "react-hot-toast";
import styles from "@/styles/pages/Contact.module.scss";
import { stylesConfig } from "@/utils/functions";
import { Input, Textarea } from "@/library/form";
import Button from "@/library/Button";

const classes = stylesConfig(styles, "contact");

const ContactUsPage: React.FC = () => {
	const [email, setEmail] = useState({
		name: "",
		email: "",
		message: "",
	});

	const handleChange = (e: any) => {
		setEmail((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		toast.success("Email sent successfully!");
	};

	return (
		<main className={classes("")}>
			<div className={classes("-left")}>
				<Image
					src="https://www.stonewoodproducts.com/wp-content/uploads/2018/11/montauk-structured-wide-plank-rift-sawn-flooring-375x455.jpg"
					alt="Contact Us"
					width={2000}
					height={1000}
				/>
			</div>
			<div className={classes("-right")}>
				<Typography
					type="heading"
					variant="display"
					className={classes("-right-heading")}
				>
					Contact Us
				</Typography>
				<div className={classes("-right-content")}>
					<form className={classes("-form")} onSubmit={handleSubmit}>
						<Input
							name="name"
							placeholder="Enter your name"
							value={email.name}
							onChange={handleChange}
						/>
						<Input
							name="email"
							placeholder="Enter your email"
							value={email.email}
							onChange={handleChange}
						/>
						<Textarea
							name="message"
							placeholder="Enter your message"
							value={email.message}
							onChange={handleChange}
							rows={5}
						/>
						<Button
							variant="dark"
							type="submit"
							className={classes("-form-button")}
						>
							Send Message
						</Button>
					</form>
					<div className={classes("-details")}>
						<div className={classes("-details-item")}>
							<Typography type="heading" variant="title-2">
								Reach out at
							</Typography>
							<a
								href="mailto:meraki@iiitu.ac.in"
								target="_blank"
								rel="noreferrer"
							>
								<Typography type="body" variant="large">
									meraki@iiitu.ac.in
								</Typography>
							</a>
						</div>
						<div className={classes("-details-item")}>
							<Typography type="heading" variant="title-2">
								Based in
							</Typography>
							<Typography type="body" variant="large">
								IIIT Una, Saloh - 177209, Tehsil Haroli, Distt.
								Una, Himachal Pradesh
							</Typography>
						</div>
						<div className={classes("-details-item")}>
							<Typography type="heading" variant="title-2">
								Connect with us
							</Typography>
							<div className={classes("-details-item-socials")}>
								{socials.map((social, index) => (
									<a
										key={social.name + index}
										href={social.url}
										target="_blank"
										rel="noreferrer"
										title={social.name}
									>
										{social.icon}
									</a>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default ContactUsPage;
