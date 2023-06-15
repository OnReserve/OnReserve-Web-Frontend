import { Flex, Button, Heading, Icon } from "@chakra-ui/react";
import {
	HiHomeModern,
	HiUserGroup,
	HiTicket,
	HiRectangleGroup,
} from "react-icons/hi2";
import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AdminGuard } from "./AdminGuard";

export const DashboardOutlet = () => {
	const location = useLocation();
	const links = [
		{
			label: "Home",
			icon: HiHomeModern,
			path: "/admin",
		},
		{
			label: "Admins",
			icon: HiUserGroup,
			path: "/admin/list",
		},
		{
			label: "Categories",
			icon: HiRectangleGroup,
			path: "/admin/categories",
		},
		{
			label: "Bookings",
			icon: HiTicket,
			path: "/admin/bookings",
		},
	];
	return (
		<AdminGuard>
			<Flex direction={"column"}>
				<Navbar />
				<Flex
					minH={"100vh"}
					background={"gray.100"}
					px={["5", "10", "20"]}
					py="4"
					alignItems={"flex-start"}
				>
					<Flex
						direction={"column"}
						as="aside"
						flex={"1"}
						gap="2"
						position={"sticky"}
					>
						{links.map((_link, _i) => (
							<Button
								key={_i}
								as={NavLink}
								to={_link.path}
								justifyContent={"flex-start"}
								leftIcon={<Icon as={_link.icon} />}
								colorScheme={
									location.pathname === _link.path
										? "blue"
										: undefined
								}
								variant={
									location.pathname === _link.path
										? "solid"
										: "ghost"
								}
							>
								{_link.label}
							</Button>
						))}
					</Flex>
					<Flex flex={"4"} direction={"column"} ml="10">
						<Outlet />
					</Flex>
				</Flex>
				<Footer />
			</Flex>
		</AdminGuard>
	);
};
