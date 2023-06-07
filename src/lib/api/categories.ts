import axios from "axios";
import { ILoginResponse } from "./auth";
import { baseURL } from "$config/api";

interface ICategoryResponse {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export const getCategories = async (user: ILoginResponse | undefined) => {
	if (user) {
		const categories = await axios
			.get<ICategoryResponse[]>(`${baseURL}/categories`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);

		return categories;
	}
};

export const categoryAPI = { getCategories };
