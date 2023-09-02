import React from "react";

const Brochure: React.FC = () => <></>;

export default Brochure;

export const getServerSideProps = async () => {
	return {
		redirect: {
			destination: "https://akshatmittal61.vercel.app/",
			permanent: true,
		},
	};
};
