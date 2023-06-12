import { categoryAPI } from "$lib/api/categories";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
	const query = useQuery({
		queryKey: ["loadCategories"],
		queryFn: () => categoryAPI.getCategories(),
	});

	return query;
};
