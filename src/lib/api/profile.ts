import axios from "axios";
import { ILoginResponse } from "./auth";
import { baseURL } from "$config/api";

export interface IProfileResponse {
	id: number;
	fname: string;
	lname: string;
	email: string;
	createdAt: string;
	updatedAt: string;
	phoneNumber: string;
	profilePic: string;
	bio: string;
}

const getProfile = async (user: ILoginResponse | undefined) => {
	if (user) {
		const profile = await axios
			.get<IProfileResponse>(`${baseURL}/profile/${user.id}`, {
				headers: {
					authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);

		return profile;
	}
};

export interface IEditProfile {
	fname: string;
	lname: string;
	phoneNumber: string;
	bio: string;
	profilePic: any;
	coverPic: any;
}

const editProfile = async (
	user: ILoginResponse | undefined,
	data: IEditProfile
) => {
	if (user) {
		const formdata = new FormData();
		let key: keyof typeof data;

		for (key in data) {
			formdata.append(key, data[key]);
		}

		const updatedUser = await axios
			.post(`${baseURL}/profile/${user.id}`, formdata, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);

		return updatedUser;
	}
};

export const profileAPI = { getProfile, editProfile };
