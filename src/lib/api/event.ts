import { IAddEventForm } from "$pages/Events/AddEvents";
import axios from "axios";
import { ILoginResponse } from "./auth";
import { baseURL } from "$config/api";
import { IEditEventForm } from "$pages/Events/EditEvents";

const addEvent = async (
	user: ILoginResponse | undefined,
	data: IAddEventForm
) => {
	if (user) {
		const { images, categories, ...values } = data;
		const formdata = new FormData();
		let key: keyof typeof values;
		for (key in values) {
			formdata.append(key, values[key].toString());
		}

		for (let file of images) {
			formdata.append("images", file);
		}

		for (let category of categories) {
			formdata.append("categories", category.toString());
		}

		const event = await axios
			.post(`${baseURL}/event/add`, formdata, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);

		return event;
	}
};

export interface IEventUserResponse {
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
	galleries: Gallery[];
	locations?: Location[];
	company?: Company;
}

export interface Gallery {
	id: number;
	eventId: number;
	eventPhoto: string;
	createdAt: any;
	updatedAt: any;
}

export interface Location {
	id: number;
	eventId: number;
	city: string;
	street: string;
	venue: string;
	latitude: number;
	longitude: number;
	createdAt: any;
	updatedAt: any;
}

export interface Company {
	id: number;
	owner: number;
	name: string;
	bio: string;
	profPic: string;
	coverPic: string;
	rating: string;
	createdAt: string;
	updatedAt: string;
}

const getUserEvents = async (user: ILoginResponse | undefined) => {
	if (user) {
		const events = await axios
			.get<IEventUserResponse[]>(`${baseURL}/events/user`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);

		return events;
	}
};

const getUpcomingEvents = async () => {
	const events = await axios
		.get<IEventUserResponse[]>(`${baseURL}/events/upcoming`)
		.then((res) => res.data);

	return events;
};

const getPopularEvents = async () => {
	const events = await axios
		.get<IEventUserResponse[]>(`${baseURL}/events/popular`)
		.then((res) => res.data);

	return events;
};

const getEventDetails = async (eventId: number) => {
	const detail = await axios
		.get<IEventUserResponse>(`${baseURL}/event/${eventId}`)
		.then((res) => res.data);

	return detail;
};

const editEvent = async (
	user: ILoginResponse | undefined,
	eventId: string,
	data: IEditEventForm
) => {
	let newDict: any = {};
	let key: keyof typeof data;

	for (key in data) {
		if (data[key]) {
			newDict[key] = data[key];
		}
	}

	console.log(newDict);

	if (user) {
		const event = await axios
			.post(`${baseURL}/event/${eventId}`, newDict, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);

		return event;
	}
};

const deleteEvent = async (
	user: ILoginResponse | undefined,
	eventId: number
) => {
	if (user) {
		const edelete = await axios
			.delete(`${baseURL}/event/${eventId}`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);

		return edelete;
	}
};

const addBooking = async (
	user: ILoginResponse | undefined,
	data: {
		eventId: number;
		economyCount: number;
		vipCount: number;
	}
) => {
	const booking = await axios
		.post(`${baseURL}/booking/add`, data, {
			headers: {
				Authorization: `Bearer ${user?.token}`,
			},
		})
		.then((res) => res.data);

	return booking;
};

type GetEvents = {
	type: "filter" | "popular" | "upcoming";
	filter?: {
		keyword?: string;
		category?: number;
		from?: string | Date;
		until?: string | Date;
		city?: string;
		venue?: string;
		minPrice?: number;
		maxPrice?: number;
	};
};

const getEvents = async (params: GetEvents) => {
	if (params.type === "upcoming") {
		return await getUpcomingEvents();
	} else if (params.type === "popular") {
		return await getPopularEvents();
	} else {
		const filterQuery = new URLSearchParams();
		if (params.filter) {
			let key: keyof typeof params.filter;
			for (key in params.filter) {
				if (params.filter[key]) {
					filterQuery.append(
						key,
						params.filter[key]?.toString() || ""
					);
				}
			}
		}

		console.log(filterQuery.toString());

		const events = await axios
			.get<IEventUserResponse[]>(
				`${baseURL}/events/filter?${filterQuery.toString()}`
			)
			.then((res) => res.data);

		return events;
	}
};
export interface EventPaymentInfo {
	requested?: undefined;
	vipCount: number;
	economyCount: number;
	totalRevenue: number;
}
export interface EventPaymentInfoIfExist {
	message: string;
	requested: boolean;
	data: {
		id: number;
		amount: number;
		cbe_account: string;
		cbe_fullname: string;
		paid: boolean;
		eventId: number;
	};
	stat: {
		vipCount: number;
		economyCount: number;
		totalRevenue: number;
	};
}

const getEventPaymentInfo = async (
	user: ILoginResponse | undefined,
	eventId: number
) => {
	if (user) {
		const stat = await axios
			.get<EventPaymentInfo | EventPaymentInfoIfExist>(
				`${baseURL}/event/${eventId}/payment`,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			)
			.then((res) => res.data);

		return stat;
	}
};

const requestPayment = async (
	user: ILoginResponse | undefined,
	eventId: number,
	data: {
		cbeAccountNo: string;
		cbeFullName: string;
	}
) => {
	if (user) {
		return await axios
			.post(`${baseURL}/event/${eventId}/payment`, data, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);
	}
};

export const eventAPI = {
	addEvent,
	editEvent,
	deleteEvent,
	getUserEvents,
	getUpcomingEvents,
	getEventDetails,
	addBooking,
	getEvents,
	getEventPaymentInfo,
	requestPayment,
};
