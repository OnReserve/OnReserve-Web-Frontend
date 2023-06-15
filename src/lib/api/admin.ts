import axios from "axios";
import { ILoginResponse } from "./auth";
import { baseURL } from "$config/api";

export interface IStatsResponse {
	users: number;
	companies: number;
	events: number;
	admins: number;
	bookings: number;
}

const loadStats = async (user: ILoginResponse | undefined) => {
	if (user && user.role === "SUPERADMIN") {
		const stats = await axios
			.get<IStatsResponse>(`${baseURL}/admin/stats`, {
				headers: {
					Authorization: `Bearer ${user?.token}`,
				},
			})
			.then((res) => res.data);

		return stats;
	}
};

export interface IAdminList {
	id: number;
	fname: string;
	lname: string;
	email: string;
	bio: string;
	profilePic: string;
}

const loadAdmins = async (user: ILoginResponse | undefined) => {
	if (user && user.role === "SUPERADMIN") {
		const admins = await axios
			.get<IAdminList[]>(`${baseURL}/admin/admins`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);

		return admins;
	}
};

const addAdmin = async (user: ILoginResponse | undefined, email: string) => {
	if (user && user.role === "SUPERADMIN") {
		const admins = await axios
			.post(
				`${baseURL}/admin/admins`,
				{ email },
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			)
			.then((res) => res.data);

		return admins;
	}
};

const deleteAdmin = async (user: ILoginResponse | undefined, id: number) => {
	if (user && user.role === "SUPERADMIN") {
		const admins = await axios
			.delete(`${baseURL}/admin/admins/${id}`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);

		return admins;
	}
};

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
	price: number;
}

const loadBookings = async (user: ILoginResponse | undefined) => {
	if (user && user.role == "SUPERADMIN") {
		const bookings = await axios
			.get<IBookingResponse[]>(`${baseURL}/admin/bookings/unapproved`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);

		return bookings;
	}
};

const approveTicket = async (user: ILoginResponse | undefined, id: number) => {
	if (user && user.role == "SUPERADMIN") {
		return await axios
			.put(`${baseURL}/admin/booking/${id}`, undefined, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);
	}
};

export const adminAPI = {
	loadStats,
	loadAdmins,
	addAdmin,
	deleteAdmin,
	loadBookings,
	approveTicket,
};
