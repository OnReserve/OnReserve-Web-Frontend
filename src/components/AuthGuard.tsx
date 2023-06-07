import { ReactNode, useEffect } from "react";
import { useUser } from "../state/userState";
import { useNavigate } from "react-router-dom";

interface IAuthGuard {
	children?: ReactNode;
}
export const AuthGuard = ({ children }: IAuthGuard) => {
	const user = useUser((state) => state.user);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/auth/login");
		}
	}, [user]);

	return <>{children}</>;
};
