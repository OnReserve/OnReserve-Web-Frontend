import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";

const routerConfig = createBrowserRouter([
	{
		path: "/",
		element: <LandingPage />,
	},
]);

export { routerConfig };
