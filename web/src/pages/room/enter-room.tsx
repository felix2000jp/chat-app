import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Stack, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link as ReactLink, useNavigate } from "react-router-dom";
import { selectRoomFormSchema } from "~/schemas/room.schemas";
import { type SelectRoomArgs, type SelectRoomData, type SelectRoomForm } from "~/types/room.types";
import { httpClient } from "~/utils/http-client";
import { type ProblemDetails } from "~/utils/problem-details";

export const EnterRoom = () => {
	const navigate = useNavigate();

	const toast = useToast({ isClosable: true, position: "top" });

	const {
		register,
		handleSubmit,
		formState: { errors: errors }
	} = useForm<SelectRoomForm>({ resolver: zodResolver(selectRoomFormSchema) });

	const selectRoom = useMutation<SelectRoomData, ProblemDetails, SelectRoomArgs>(
		"select-room",
		async (vars) => {
			const reply = await httpClient.get<SelectRoomData>(`Room/select-room/${vars.name}`);
			return reply.data;
		},
		{
			onSuccess: (data) => {
				toast({ status: "success", title: `You successfully entered ${data.name}` });
				navigate(`/${data.name}`);
			},
			onError: (error) => {
				toast({ status: "error", title: error.title });
				if (error.status === 401) navigate("/sign-in");
			}
		}
	);

	return (
		<Flex
			minHeight={"100vh"}
			background={"purple.50"}
			alignItems={"center"}
			justifyContent={"center"}
		>
			<Stack spacing={10}>
				<Heading>Enter an existing room</Heading>
				<Box
					background={"white"}
					rounded={"lg"}
					boxShadow={"lg"}
					padding={6}
				>
					<form
						action={"submit"}
						onSubmit={handleSubmit((form) => selectRoom.mutate({ name: form.name }))}
					>
						<Stack spacing={4}>
							<FormControl isInvalid={!!errors.name}>
								<FormLabel htmlFor={"name"}>Name</FormLabel>
								<Input
									type={"text"}
									placeholder={"John Doe's room"}
									{...register("name")}
								/>
								<FormErrorMessage>{errors.name?.message}</FormErrorMessage>
							</FormControl>

							<Button
								type={"submit"}
								colorScheme={"purple"}
								variant={"solid"}
								isLoading={selectRoom.isLoading}
							>
								Enter room
							</Button>
							<Button
								type={"button"}
								colorScheme={"purple"}
								variant={"ghost"}
								as={ReactLink}
								to={"/create-room"}
							>
								Create room
							</Button>
						</Stack>
					</form>
				</Box>
			</Stack>
		</Flex>
	);
};
