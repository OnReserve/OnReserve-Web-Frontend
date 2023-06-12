import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface IFilter {
	categoryId?: number;
	eventStartDate?: string;
	eventEndDate?: string;
	location?: string;
	priceLow?: number;
	priceHigh?: number;
}

interface State {
	filter: IFilter;
}

interface Actions {
	setFilterItem: (key: keyof IFilter, value: any) => void;
	clear: () => void;
}

export const useFilter = create(
	devtools(
		immer<State & Actions>((set) => ({
			filter: {} as IFilter,
			clear: () =>
				set((state) => {
					state.filter = {} as IFilter;
				}),
			setFilterItem(key, value) {
				set((state) => {
					state.filter[key] = value;
				});
			},
		}))
	)
);
