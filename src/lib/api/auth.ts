import { baseURL } from "$config/api";
import axios from "axios";

export interface ILoginParams {
	email: string;
	password: string;
}

export interface ILoginResponse {
	token: string;
	phoneNumber: string | null;
	profilePic: string | null;
	coverPic: string | null;
	bio: string | null;
	id: number;
	fname: string;
	lname: string;
	email: string;
	role: "USER" | "SUPERADMIN";
	createdAt: Date | null;
	updatedAt: Date | null;
}

const login = async (data: ILoginParams) => {
	const user = await axios
		.post<ILoginResponse>(`${baseURL}/auth/login`, data)
		.then((res) => res.data);

	return user;
};

export interface ISignupParams {
	fname: string;
	lname: string;
	email: string;
	password: string;
}

export interface ISignupResponse {
	message: string;
	userId: string;
	token: string;
}

const signUp = async (data: ISignupParams) => {
	const user = await axios
		.post<ISignupResponse>(`${baseURL}/auth/register`, data)
		.then((res) => res.data);
	return user;
};

export const userAPI = { signUp, login };
