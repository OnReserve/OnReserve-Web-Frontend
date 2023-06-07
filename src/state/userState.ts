import { ILoginResponse } from "$lib/api/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
	user?: ILoginResponse;
};

type Actions = {
	setUser: (newUser: ILoginResponse) => void;
	logout: () => void;
};

const useUser = create(
	persist(
		immer<Actions & State>((set) => ({
			user: undefined,
			setUser: (newUser: ILoginResponse) =>
				set((state) => {
					state.user = newUser;
				}),
			logout: () =>
				set((state) => {
					state.user = undefined;
				}),
		})),
		{
			name: "user-state",
		}
	)
);

export { useUser };
