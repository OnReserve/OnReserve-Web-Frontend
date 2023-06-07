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
			.get<IProfileResponse>(`${baseURL}/profile/${user.userId}`, {
				headers: {
					authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);

		return profile;
	}
};

export const profileAPI = { getProfile };
