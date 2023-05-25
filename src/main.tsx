import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import { routerConfig } from "./config/router.tsx";
import { extendedTheme } from "$config/theme.tsx";
import "@fontsource/open-sans/400.css";
import "@fontsource/raleway/600.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ChakraProvider theme={extendedTheme}>
			<RouterProvider router={routerConfig} />
		</ChakraProvider>
	</React.StrictMode>
);
