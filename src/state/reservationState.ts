import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type PackageType = "NORMAL" | "VIP" | "VVIP";

type State = {
	packages: PackageType[];
};
type Actions = {
	addPackage: (type: PackageType) => void;
	changePackage: (index: number, type: PackageType) => void;
	removePackage: (index: number) => void;
	clear: () => void;
};

export const useReservation = create(
	devtools(
		immer<State & Actions>((set) => ({
			packages: [],
			addPackage: (type: PackageType) =>
				set((state) => {
					state.packages.push(type);
				}),
			changePackage: (index: number, type: PackageType) =>
				set((state) => {
					if (state.packages[index]) {
						state.packages[index] = type;
					}
				}),
			removePackage: (index: number) =>
				set((state) => ({
					...state,
					packages: state.packages.filter(
						(val, _index) => index != _index
					),
				})),
			clear: () =>
				set((state) => ({
					...state,
					packages: [],
				})),
		}))
	)
);
