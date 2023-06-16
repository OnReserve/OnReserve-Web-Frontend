import axios from "axios";
import { ILoginResponse } from "./auth";
import { baseURL } from "$config/api";

export interface IReviewRequest {
	rating: number;
	comment: string;
}

export interface IReviewResponse {
	rating: number;
	reviews: IReview[];
}

export interface IReview {
	id: number;
	userId: number;
	eventId: number;
	comment: string;
	stars: number;
	createdAt: any;
	updatedAt: any;
	user: User;
}

export interface User {
	id: number;
	fname: string;
	lname: string;
	email: string;
	profile: {
		profilePic: string;
	};
}

const addReview = async (
	user: ILoginResponse | undefined,
	eventId: number,
	data: IReviewRequest
) => {
	if (user) {
		return await axios
			.post(
				`${baseURL}/event/${eventId}/ratings`,
				{ comment: data.comment, stars: `${data.rating}` },
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			)
			.then((res) => res.data);
	}
};

const getReviews = async (eventId: number) => {
	const reviews = await axios
		.get<IReviewResponse>(`${baseURL}/event/${eventId}/ratings`)
		.then((res) => res.data);

	return reviews;
};

const deleteReview = async (
	user: ILoginResponse | undefined,
	reviewId: number
) => {
	if (user) {
		const deleted = await axios
			.delete(`${baseURL}/event/ratings/${reviewId}`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			})
			.then((res) => res.data);
		return deleted;
	}
};

const editReview = async (
	user: ILoginResponse | undefined,
	reviewId: number,
	data: IReviewRequest
) => {
	if (user) {
		const review = await axios.put(
			`${baseURL}/event/ratings/${reviewId}`,
			{ comment: data.comment, stars: `${data.rating}` },
			{
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			}
		);

		return review;
	}
};

export const reviewAPI = {
	addReview,
	editReview,
	deleteReview,
	getReviews,
};
