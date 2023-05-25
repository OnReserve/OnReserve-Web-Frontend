import {
	Button,
	Card,
	Flex,
	HStack,
	Heading,
	Icon,
	Img,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Text,
} from "@chakra-ui/react";
import { Navbar } from "../../components/Navbar";
import { HiCheckBadge } from "react-icons/hi2";
import { Footer } from "../../components/Footer";
import { NavLink } from "react-router-dom";

export const EventsDetailsPage = () => {
	return (
		<Flex direction="column">
			<Navbar />
			<Flex px="20" py="10" gap={"10"}>
				<Flex direction={"column"} flex="1">
					<Img
						borderRadius={"lg"}
						src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
						width={"100%"}
					/>
				</Flex>
				<Flex flex="2" direction={"column"}>
					<Heading mb="4">
						Rophnan's My Second Generations Concert
					</Heading>
					<Flex justifyContent={"space-between"}>
						<Text color="blue.500" fontWeight={"bold"}>
							Rophanan Concerts{" "}
							<Icon fontSize={"xl"}>
								<HiCheckBadge />
							</Icon>
						</Text>
						<Flex
							direction={"column"}
							alignItems={"flex-end"}
							color="blue.900"
							fontWeight={"bold"}
						>
							<Text>Jan 14, 2022</Text>
							<Text>03:00 AM</Text>
						</Flex>
					</Flex>
					<Text my="4">
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Molestias officiis aliquam distinctio eum harum eveniet
						neque, voluptatum molestiae? Illo excepturi iusto ipsum
						commodi nemo quod nihil veritatis voluptas cum nulla.
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Facilis, aut nobis fuga commodi blanditiis corporis
						optio, sint et aliquid itaque similique vero dolore
						dolorum nam harum vitae vel incidunt nostrum.
					</Text>
					<Flex as={"section"} direction={"column"} my="8">
						<Heading size={"lg"} mb="5">
							Packages
						</Heading>
						<HStack wrap={"wrap"} gap={"4"}>
							<Stat
								border={"1px"}
								borderColor={"gray.200"}
								borderRadius={"lg"}
								p="3"
							>
								<StatLabel>Normal</StatLabel>
								<StatNumber>300 ETB</StatNumber>
								<StatHelpText>100 Seats Available</StatHelpText>
							</Stat>
							<Stat
								border={"1px"}
								borderColor={"gray.200"}
								borderRadius={"lg"}
								p="3"
							>
								<StatLabel>VIP</StatLabel>
								<StatNumber>500 ETB</StatNumber>
								<StatHelpText>100 Seats Available</StatHelpText>
							</Stat>
							<Stat
								border={"1px"}
								borderColor={"gray.200"}
								borderRadius={"lg"}
								p="3"
							>
								<StatLabel>VVIP</StatLabel>
								<StatNumber>800 ETB</StatNumber>
								<StatHelpText>100 Seats Available</StatHelpText>
							</Stat>
						</HStack>
					</Flex>
					<Flex mt="10" direction={"column"}>
						<Heading size={"lg"} mb="3">
							Location
						</Heading>
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.559483514531!2d38.753567624377354!3d9.012618391048086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85bf02f0f01f%3A0x139feaf0e87089eb!2sGhion%20Hotel%20%7C%20Stadium!5e0!3m2!1sen!2sus!4v1684068754540!5m2!1sen!2sus"
							width="100%"
							height="300"
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
						></iframe>
					</Flex>
					<Button
						as={NavLink}
						to={"/reserve/123"}
						my="20"
						background={"blue.900"}
						colorScheme="blue"
					>
						Reserve
					</Button>
				</Flex>
			</Flex>
			<Footer />
		</Flex>
	);
};
