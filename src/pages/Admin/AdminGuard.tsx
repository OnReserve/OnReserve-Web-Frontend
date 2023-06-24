import { ReactNode } from "react";
import { useUser } from "../../state/userState";
import { NavLink } from "react-router-dom";
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Button,
	Flex,
	Text,
} from "@chakra-ui/react";

export const AdminGuard = ({ children }: { children?: ReactNode }) => {
	const user = useUser((state) => state.user);

	if (!user || user.role != "SUPERADMIN") {
		return (
			<Flex
				height={"100vh"}
				width={"100%"}
				justifyContent={"center"}
				alignItems={"center"}
				px={["5", "10", "20"]}
				background={"gray.100"}
			>
				<Alert
					status="error"
					variant={"solid"}
					flexDirection={"column"}
					alignItems={"center"}
					textAlign={"center"}
					width={"50%"}
					boxShadow={"lg"}
					p="10"
				>
					<AlertIcon boxSize={"10"} mb="2" />
					<AlertTitle mb="1" fontSize={"2xl"}>
						Access unauthorized
					</AlertTitle>
					<AlertDescription>
						<Flex direction={"column"}>
							<Text mb="10">
								You don't have an authorization to access this
								route
							</Text>
							<Button
								as={NavLink}
								to="/profile"
								variant={"link"}
								colorScheme="whiteAlpha"
								color={"white"}
							>
								Go Back to your Profile
							</Button>
						</Flex>
					</AlertDescription>
				</Alert>
			</Flex>
		);
	}

	return <>{children}</>;
};
