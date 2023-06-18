import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface IFilter {
	keyword?: string;
	category?: number;
	from?: string;
	until?: string;
	city?: string;
	venue?: string;
	minPrice?: number;
	maxPrice?: number;
}

interface State {
	filter: IFilter;
	finalFilter: IFilter;
}

interface Actions {
	setFilterItem: (key: keyof IFilter, value: any) => void;
	clear: () => void;
	setFinalFilter: () => void;
}

export const useFilter = create(
	devtools(
		immer<State & Actions>((set) => ({
			filter: {} as IFilter,
			finalFilter: {} as IFilter,
			clear: () =>
				set((state) => {
					state.filter = {} as IFilter;
					state.finalFilter = {} as IFilter;
				}),
			setFilterItem(key, value) {
				set((state) => {
					state.filter[key] = value;
				});
			},
			setFinalFilter: () =>
				set((state) => {
					state.finalFilter = state.filter;
				}),
		}))
	)
);
