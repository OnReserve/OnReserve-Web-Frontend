import axios from "axios";
import { ILoginResponse } from "./auth";
import { baseURL } from "$config/api";

export interface ICategoryResponse {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
	_count: {
		events: number;
	};
}

export const getCategories = async () => {
	const categories = await axios
		.get<ICategoryResponse[]>(`${baseURL}/categories`)
		.then((res) => res.data);

	return categories;
};

export const addCategory = async (
	user: ILoginResponse | undefined,
	category: string
) => {
	if (user && user.role === "SUPERADMIN") {
		const newCategory = await axios
			.post(
				`${baseURL}/category/add`,
				{
					name: category,
				},
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			)
			.then((res) => res.data);

		return newCategory;
	}
};

export const deleteCategory = async (
	user: ILoginResponse | undefined,
	id: number
) => {
	if (user && user.role === "SUPERADMIN") {
		const newCategory = await axios
			.delete(`${baseURL}/category/${id}`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);

		return newCategory;
	}
};

export const updateCategory = async (
	user: ILoginResponse | undefined,
	id: number,
	category: string
) => {
	if (user && user.role === "SUPERADMIN") {
		const newCategory = await axios
			.put(
				`${baseURL}/category/${id}`,
				{
					name: category,
				},
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			)
			.then((res) => res.data);

		return newCategory;
	}
};

export const categoryAPI = {
	getCategories,
	deleteCategory,
	updateCategory,
	addCategory,
};
