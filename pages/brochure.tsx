import React from "react";

const Brochure: React.FC = () => <></>;

export default Brochure;

export const getServerSideProps = async () => {
	return {
		redirect: {
			destination:
				"https://drive.google.com/file/d/1zl979feuLpyHCEb3qMOMYIjg4zMHqcjf/view",
			permanent: true,
		},
	};
};
