import axios from "axios";
import { ILoginResponse } from "./auth";
import { baseURL } from "$config/api";

interface ICategoryResponse {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export const getCategories = async () => {
	const categories = await axios
		.get<ICategoryResponse[]>(`${baseURL}/categories`)
		.then((res) => res.data);

	return categories;
};

export const categoryAPI = { getCategories };
