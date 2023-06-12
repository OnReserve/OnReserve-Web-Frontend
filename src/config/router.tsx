import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "$pages/LandingPage";
import { Login } from "$pages/Auth/Login";
import { SignUp } from "$pages/Auth/SignUp";
import { EventsPage } from "$pages/Events/Events";
import { EventsDetailsPage } from "$pages/Events/EventDetails";
import { ReservationPage } from "$pages/Reserve/Reserve";
import { ProfileViewPage } from "$pages/Profile/ProfileView";
import { CompanyDetailsPage } from "$pages/Company/CompanyDetails";
import { AddEventPage } from "$pages/Events/AddEvents";
import { EditEventPage } from "$pages/Events/EditEvents";

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
		path: "/event/add",
		element: <AddEventPage />,
	},
	{
		path: "/event/edit/:eventId",
		element: <EditEventPage />,
	},
	{
		path: "/reserve/:eventId",
		element: <ReservationPage />,
	},
	{
		path: "/profile",
		element: <ProfileViewPage />,
	},
	{
		path: "/company/:id",
		element: <CompanyDetailsPage />,
	},
]);

export { routerConfig };
