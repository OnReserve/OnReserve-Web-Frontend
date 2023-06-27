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
import { AdminPage } from "$pages/Admin";
import { DashboardOutlet } from "$pages/Admin/DashboardOutlet";
import { AdminsList } from "$pages/Admin/admins";
import { AdminBookingPage } from "$pages/Admin/AdminBookings";
import { BookingPage } from "$pages/Booking/BookingsList";
import { AdminCategories } from "$pages/Admin/AdminCategories";
import { BookingDetails } from "$pages/Booking/BookingDetails";
import { RequestPayment } from "$pages/Events/RequestPayment";
import { AdminRequestPage } from "$pages/Admin/AdminPayment";

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
		path: "/event/payment/:eventId",
		element: <RequestPayment />,
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
	{
		path: "/profile/bookings",
		element: <BookingPage />,
	},
	{
		path: "/profile/booking/:id",
		element: <BookingDetails />,
	},
	{
		path: "/admin",
		element: <DashboardOutlet />,
		children: [
			{
				path: "/admin",
				element: <AdminPage />,
			},
			{
				path: "/admin/list",
				element: <AdminsList />,
			},
			{
				path: "/admin/bookings",
				element: <AdminBookingPage />,
			},
			{
				path: "/admin/categories",
				element: <AdminCategories />,
			},
			{
				path: "/admin/payment-request",
				element: <AdminRequestPage />,
			},
		],
	},
]);

export { routerConfig };
