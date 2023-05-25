import {
	Button,
	Flex,
	HStack,
	Heading,
	Icon,
	IconButton,
	Img,
	Select,
	SelectField,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import { Navbar } from "../../components/Navbar";
import {
	HiCheckBadge,
	HiPaintBrush,
	HiPlus,
	HiTrash,
	HiXCircle,
	HiXMark,
} from "react-icons/hi2";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Footer } from "../../components/Footer";
import { useReservation } from "../../state/reservationState";
import { useEffect, useMemo, useState } from "react";
import { loginInitialValues } from "$pages/Auth/lib/schema";

export const ReservationPage = () => {
	const eventId = useParams();
	const clear = useReservation((state) => state.clear);

	useEffect(() => {
		clear();
	}, [eventId]);

	return (
		<Flex direction={"column"}>
			<Navbar />
			<Flex px="20" py="10" gap={"10"}>
				<Flex direction={"column"} flex="1">
					<Img
						borderRadius={"lg"}
						src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
						width={"100%"}
					/>
					<Heading mt="6" mb="2" size={"md"}>
						Rophnan's My Second Generations Concert
					</Heading>
					<Text color="blue.500" fontWeight={"bold"} mb="6">
						Rophanan Concerts{" "}
						<Icon fontSize={"xl"}>
							<HiCheckBadge />
						</Icon>
					</Text>

					<Flex direction={"column"} my="4" gap={"4"}>
						<Stat>
							<StatLabel>Event Location</StatLabel>
							<StatNumber>Ghion Hotel</StatNumber>
						</Stat>
						<Stat>
							<StatLabel>Event Date</StatLabel>
							<StatNumber>Jan 14, 2022</StatNumber>
						</Stat>
						<Stat>
							<StatLabel>Event Time</StatLabel>
							<StatNumber>03:00 LT</StatNumber>
						</Stat>
					</Flex>
				</Flex>
				<Flex flex="2" direction={"column"}>
					<Flex as={"section"} direction={"column"} mb="8">
						<Heading size={"lg"} mb="5">
							Your Packages
						</Heading>
						<PackagesList />
						<Button
							as={NavLink}
							to={"/reserve/123"}
							my="20"
							background={"blue.900"}
							colorScheme="blue"
						>
							Continue to Payment
						</Button>
					</Flex>
				</Flex>
			</Flex>
			<Footer />
		</Flex>
	);
};

const PackagesList = () => {
	const [type, setType] = useState("");
	const [total, setTotal] = useState(0);
	const packages = useReservation((state) => state.packages);
	const addPackage = useReservation((state) => state.addPackage);
	const changePackage = useReservation((state) => state.changePackage);
	const deletePackage = useReservation((state) => state.removePackage);
	const clear = useReservation((state) => state.clear);
	const prices = {
		NORMAL: 300,
		VIP: 500,
		VVIP: 800,
	};

	useMemo(() => {
		let sum = 0;
		packages.forEach((_type) => {
			sum += prices[_type];
		});
		setTotal(sum);
	}, [packages]);

	return (
		<Flex direction={"column"} flex="1">
			<Table mb="10">
				<Thead>
					<Tr>
						<Th>No</Th>
						<Th>Package Type</Th>
						<Th>Price</Th>
						<Th>Delete</Th>
					</Tr>
				</Thead>
				<Tbody>
					{packages.map((_package, _index) => {
						return (
							<Tr key={_index}>
								<Td>{_index + 1}</Td>
								<Td>
									<Select
										value={_package}
										onChange={(e) =>
											changePackage(
												_index,
												e.target.value as any
											)
										}
									>
										<option value="" disabled>
											Select Package type
										</option>
										<option value={"NORMAL"}>Normal</option>
										<option value={"VIP"}>VIP</option>
										<option value={"VVIP"}>VVIP</option>
									</Select>
								</Td>
								<Td>{prices[_package]}</Td>
								<Td>
									<IconButton
										icon={<HiTrash />}
										aria-label="delete"
										onClick={() => deletePackage(_index)}
									></IconButton>
								</Td>
							</Tr>
						);
					})}
					{packages.length > 0 && (
						<Tr>
							<Td>Total</Td>
							<Td></Td>
							<Td fontWeight={"bold"}>{total} ETB</Td>
							<Td>
								<Button
									onClick={() => clear()}
									aria-label="Clear"
									size={"sm"}
									leftIcon={<HiXCircle />}
								>
									Clear
								</Button>
							</Td>
						</Tr>
					)}
				</Tbody>
			</Table>
			<Button
				leftIcon={<HiPlus />}
				size={"sm"}
				onClick={() => addPackage("NORMAL")}
			>
				Add Package
			</Button>
		</Flex>
	);
};
