import axios from "axios";
import { ILoginResponse } from "./auth";
import { baseURL } from "$config/api";

const getBookings = async (user: ILoginResponse | undefined) => {
	const bookings = await axios
		.get(`${baseURL}/bookings`, {
			headers: {
				Authorization: `Bearer ${user?.token}`,
			},
		})
		.then((res) => res.data);

	return bookings;
};

const getBookingDetails = async (
	user: ILoginResponse | undefined,
	id: number
) => {};

export const bookingAPI = { getBookings };
