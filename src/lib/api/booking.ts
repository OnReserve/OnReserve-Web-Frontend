import axios from "axios";
import { ILoginResponse } from "./auth";
import { baseURL } from "$config/api";

export interface IBookingResponse {
	id: number;
	userId: number;
	eventId: number;
	approved: boolean;
	completed: boolean;
	bookingToken: string;
	qrcode: string;
	economyCount: number;
	vipCount: number;
	createdAt: string;
	updatedAt: string;
	event: IBookingEvent;
}

export interface IBookingEvent {
	id: number;
	userId: number;
	companyId: number;
	title: string;
	desc: string;
	createdAt: string;
	updatedAt: string;
	eventStartTime: string;
	eventEndTime: string;
	eventDeadline: string;
	approved: boolean;
	approvedBy: any;
	economySeats: number;
	economyPrice: number;
	vipSeats: number;
	vipPrice: number;
}

const getBookings = async (user: ILoginResponse | undefined) => {
	const bookings = await axios
		.get<IBookingResponse[]>(`${baseURL}/bookings`, {
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
) => {
	if (user) {
		const details = await axios
			.get(`${baseURL}/booking/${id}`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);

		return details;
	}
};

export const bookingAPI = { getBookings, getBookingDetails };
