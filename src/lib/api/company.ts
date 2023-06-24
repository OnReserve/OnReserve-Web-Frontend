import axios from "axios";
import { ILoginResponse } from "./auth";
import { baseURL } from "$config/api";

export interface ICompany {
	id: number;
	owner: number;
	name: string;
	bio: string;
	profPic: string;
	coverPic: string;
	rating: string;
	createdAt: any;
	updatedAt: any;
	_count: {
		events: number;
		users: number;
	};
}

type IUserCompanyResponse = {
	company: ICompany;
}[];

const getUserCompanies = async (user: ILoginResponse | undefined) => {
	if (user) {
		const companies = await axios
			.get<IUserCompanyResponse>(`${baseURL}/companies`, {
				headers: {
					Authorization: "Bearer " + user?.token,
				},
			})
			.then((res) => res.data);

		return companies;
	}
};

interface IAddCompanyParams {
	name: string;
	bio: string;
	profilePic: any;
	coverPic: any;
}

const addCompany = async (
	user: ILoginResponse | undefined,
	data: IAddCompanyParams
) => {
	if (user) {
		const formData = new FormData();
		let key: keyof typeof data;
		for (key in data) {
			formData.append(key, data[key]);
		}

		const company = await axios
			.post(`${baseURL}/company/add`, formData, {
				headers: {
					Authorization: `Bearer ${user?.token}`,
				},
			})
			.then((res) => res.data);

		return company;
	}
};

export interface ICompanyDetailsResponse {
	id: number;
	owner: number;
	name: string;
	bio: string;
	profPic: string;
	coverPic: string;
	rating: string;
	createdAt: string;
	updatedAt: string;
	users: { user: ICompanyAdminResponse }[];
	events: EventResponse[];
}
export interface EventResponse {
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
}

export interface Gallery {
	id: number;
	eventId: number;
	eventPhoto: string;
	createdAt: any;
	updatedAt: any;
}

export interface ICompanyAdminResponse {
	id: number;
	fname: string;
	lname: string;
	email: string;
	profile: {
		profilePic: string;
	};
}

const getCompanyDetails = async (
	user: ILoginResponse | undefined,
	companyId: number
) => {
	if (user) {
		const company = await axios
			.get<ICompanyDetailsResponse>(`${baseURL}/company/${companyId}`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);
		return company;
	}
};

const addCompanyAdmin = async (
	user: ILoginResponse | undefined,
	companyID: number,
	email: string
) => {
	if (user) {
		const admin = await axios
			.post(
				`${baseURL}/company/${companyID}/admins`,
				{ email },
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			)
			.then((res) => res.data);
		return admin;
	}
};

const deleteCompany = async (
	user: ILoginResponse | undefined,
	companyID: number
) => {
	if (user) {
		const deleted = await axios
			.delete(`${baseURL}/company/${companyID}`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);

		return deleted;
	}
};

type IEditCompanyParams = Partial<IAddCompanyParams>;

const editCompany = async (
	user: ILoginResponse | undefined,
	companyID: number,
	data: IEditCompanyParams
) => {
	if (user) {
		const formData = new FormData();
		let key: keyof typeof data;
		for (key in data) {
			formData.append(key, data[key]);
		}

		const company = await axios
			.put<IUserCompanyResponse>(
				`${baseURL}/company/${companyID}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			)
			.then((res) => res.data);

		return company;
	}
};

export const companyAPI = {
	getUserCompanies,
	addCompany,
	editCompany,
	getCompanyDetails,
	addCompanyAdmin,
	deleteCompany,
};
