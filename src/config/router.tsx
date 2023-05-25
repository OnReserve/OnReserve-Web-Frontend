import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "$pages/LandingPage";
import { Login } from "$pages/Auth/Login";
import { SignUp } from "$pages/Auth/SignUp";
import { EventsPage } from "$pages/Events/Events";
import { EventsDetailsPage } from "$pages/Events/EventDetails";
import { ReservationPage } from "$pages/Reserve/Reserve";
import { ProfileViewPage } from "$pages/Profile/ProfileView";

const routerConfig = createBrowserRouter([
	{
		path: "/",
		element: <LandingPage />,
	},
	{
		path: "/auth/login",
		element: <Login />,
	},
	{
		path: "/auth/sign-up",
		element: <SignUp />,
	},
	{
		path: "/events",
		element: <EventsPage />,
	},
	{
		path: "/events/:eventId",
		element: <EventsDetailsPage />,
	},
	{
		path: "/reserve/:eventId",
		element: <ReservationPage />,
	},
	{
		path: "/profile",
		element: <ProfileViewPage />,
	},
]);

export { routerConfig };
