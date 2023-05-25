import {
	Avatar,
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	Heading,
	Img,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { HiPencil, HiPlus } from "react-icons/hi2";

export const ProfileViewPage = () => {
	return (
		<Flex direction={"column"}>
			<Navbar />
			<Flex
				minHeight={"100vh"}
				direction={"column"}
				px="20"
				py="5"
				background={"gray.100"}
			>
				<Flex gap={"10"}>
					<Flex
						flex={1}
						direction={"column"}
						boxShadow={"md"}
						borderRadius={"xl"}
						background="white"
						position={"relative"}
					>
						<Box position={"relative"} mb="10">
							<Img
								borderTopRadius={"xl"}
								width={"full"}
								height={"40"}
								objectFit={"cover"}
								src="https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
							></Img>
							<Avatar
								size={"2xl"}
								border={"4px solid white"}
								position={"absolute"}
								bottom={"-12"}
								left={"30"}
								src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=388&q=80"
							/>
						</Box>
						<Flex direction={"column"} p="10">
							<Heading size={"lg"} mb="3">
								Naolit Chala
							</Heading>
							<Text>
								Lorem ipsum, dolor sit amet consectetur
								adipisicing elit. Velit eaque ipsum dicta
							</Text>
						</Flex>
					</Flex>
					<Flex
						flex={2}
						background={"white"}
						p="8"
						borderRadius={"xl"}
						flexDirection={"column"}
					>
						<Flex
							alignItems={"center"}
							justifyContent={"space-between"}
						>
							<Heading fontSize={"2xl"}>Companies</Heading>
							<Button
								leftIcon={<HiPlus />}
								size={"sm"}
								colorScheme="blue"
							>
								Add Company
							</Button>
						</Flex>
						<Flex mt="5" direction={"column"}>
							<Table>
								<Tbody>
									<Tr>
										<Td fontWeight={"bold"}>
											Travel Sultan
										</Td>
										<Td>3 Admins</Td>
										<Td textAlign={"end"}>
											<Button
												leftIcon={<HiPencil />}
												size={"sm"}
											>
												Edit
											</Button>
										</Td>
									</Tr>
								</Tbody>
							</Table>
						</Flex>
					</Flex>
				</Flex>
				<Flex
					direction={"column"}
					background={"white"}
					mt="10"
					p="10"
					borderRadius={"xl"}
				>
					<Flex
						justifyContent={"space-between"}
						alignItems={"center"}
					>
						<Heading>My Events</Heading>
						<Button leftIcon={<HiPlus />}>New Event</Button>
					</Flex>
					<Grid
						gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
						mt="10"
					>
						<Flex
							direction={"column"}
							boxShadow={"lg"}
							borderRadius={"lg"}
						>
							<Img
								borderTopRadius={"lg"}
								width={"100%"}
								height={"200px"}
								objectFit={"cover"}
								src="https://images.unsplash.com/photo-1571249692357-fd1418f95042?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=465&q=80"
							></Img>
							<Flex direction={"column"} p="4">
								<Heading fontSize={"lg"} mb="3">
									Hicking to Mt. Ras Dashen
								</Heading>
								<Text fontSize={"sm"} fontWeight={"bold"}>
									Jan 20, 2023
								</Text>
								<Text fontSize={"sm"}>Tobiya Hiking</Text>
							</Flex>
						</Flex>
					</Grid>
				</Flex>
			</Flex>
			<Footer />
		</Flex>
	);
};
