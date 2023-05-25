import {
	Flex,
	SimpleGrid,
	Heading,
	VStack,
	Icon,
	Link,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export const Footer = () => {
	return (
		<Flex direction={"column"} background={"gray.200"}>
			<SimpleGrid
				columns={[1, 1, 3]}
				px="32"
				py="20"
				justifyItems={"center"}
			>
				<Flex direction={"column"}>
					<Heading mb="5" fontSize={"2xl"}>
						OnReserve
					</Heading>
					<VStack alignItems={"flex-start"}>
						<Link>Pricing</Link>
						<Link>Updates</Link>
						<Link>Beta</Link>
						<Link>Newsletter</Link>
					</VStack>
				</Flex>
				<Flex direction={"column"}>
					<Heading mb="5" fontSize={"2xl"}>
						Events
					</Heading>
					<VStack alignItems={"flex-start"}>
						<Link>Movies</Link>
						<Link>Concert</Link>
						<Link>Trip</Link>
						<Link>Climb</Link>
					</VStack>
				</Flex>
				<Flex direction={"column"}>
					<Heading mb="5" fontSize={"2xl"}>
						About
					</Heading>
					<VStack alignItems={"flex-start"}>
						<Link>Company</Link>
						<Link>Careers</Link>
						<Link>Legal</Link>
						<Link>Help</Link>
					</VStack>
				</Flex>
			</SimpleGrid>
			<Flex direction={"column"} background={"gray.200"}>
				<Flex
					p="3"
					pt="5"
					justifyContent={"center"}
					textAlign={"center"}
				>
					&copy; {new Date().getFullYear()} OnReserve. All rights
					reserved.
				</Flex>
				<Flex
					justifyContent={"center"}
					textAlign={"center"}
					gap={"5"}
					p="3"
				>
					<Link>
						<Icon boxSize={"8"}>
							<FaFacebook />
						</Icon>
					</Link>
					<Link>
						<Icon boxSize={"8"}>
							<FaTwitter />
						</Icon>
					</Link>
					<Link>
						<Icon boxSize={"8"}>
							<FaInstagram />
						</Icon>
					</Link>
				</Flex>
			</Flex>
		</Flex>
	);
};
