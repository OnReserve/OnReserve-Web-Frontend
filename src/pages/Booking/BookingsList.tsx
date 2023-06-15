import { Flex, Heading } from "@chakra-ui/react";
import { AuthGuard } from "../../components/AuthGuard";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export const BookingPage = () => {
	return (
		<AuthGuard>
			<Flex direction={"column"}>
				<Navbar />
				<Flex
					direction={"column"}
					minH={"100vh"}
					background={"gray.100"}
					px={["5", "10", "20"]}
					py="5"
				>
					<Heading>Your Bookings</Heading>
				</Flex>
				<Footer />
			</Flex>
		</AuthGuard>
	);
};
