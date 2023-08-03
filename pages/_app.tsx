import "@/styles/globals.scss";
import GlobalContext from "@/context/GlobalContext";
import useContextData from "@/context/useContext";
import Layout from "@/layouts";
import type { AppProps } from "next/app";
import AOS from "aos";
import "aos/dist/aos.css";

export default function App({ Component, pageProps }: AppProps) {
	if (typeof window !== "undefined") AOS.init();
	const context = useContextData();
	return (
		<GlobalContext.Provider value={context}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</GlobalContext.Provider>
	);
}
