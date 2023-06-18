import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider, useLocation } from "react-router-dom";
import { routerConfig } from "./config/router.tsx";
import { extendedTheme } from "$config/theme.tsx";
import "@fontsource/source-sans-pro";
import "@fontsource/raleway/600.css";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export default function ScrollToTop() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<ChakraProvider theme={extendedTheme}>
				<RouterProvider router={routerConfig}></RouterProvider>
			</ChakraProvider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	</React.StrictMode>
);
