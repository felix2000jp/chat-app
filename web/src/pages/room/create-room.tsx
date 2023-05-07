import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Stack, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link as ReactLink, useNavigate } from "react-router-dom";
import { insertRoomFormSchema } from "~/schemas/room.schemas";
import { type InsertRoomArgs, type InsertRoomData, type InsertRoomForm } from "~/types/room.types";
import { httpClient } from "~/utils/http-client";
import { type ProblemDetails } from "~/utils/problem-details";

export const CreateRoom = () => {
	const navigate = useNavigate();

	const toast = useToast({ isClosable: true, position: "top" });

	const {
		register,
		handleSubmit,
		formState: { errors: errors }
	} = useForm<InsertRoomForm>({ resolver: zodResolver(insertRoomFormSchema) });

	const insertRoom = useMutation<InsertRoomData, ProblemDetails, InsertRoomArgs>(
		"insert-room",
		async (vars) => {
			const reply = await httpClient.post<InsertRoomData>("Room/insert-room", vars.body);
			return reply.data;
		},
		{
			onSuccess: (data) => {
				toast({ status: "success", title: `You successfully created ${data.name}` });
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
				<Heading>Create a new room</Heading>
				<Box
					background={"white"}
					rounded={"lg"}
					boxShadow={"lg"}
					padding={6}
				>
					<form
						action={"submit"}
						onSubmit={handleSubmit((form) => insertRoom.mutate({ body: form }))}
					>
						<Stack spacing={4}>
							<FormControl isInvalid={!!errors.name}>
								<FormLabel htmlFor={"name"}>Name</FormLabel>
								<Input
									type={"text"}
									placeholder={"John Doe's rooms"}
									{...register("name")}
								/>
								<FormErrorMessage>{errors.name?.message}</FormErrorMessage>
							</FormControl>

							<Button
								type={"submit"}
								colorScheme={"purple"}
								variant={"solid"}
								isLoading={insertRoom.isLoading}
							>
								Create room
							</Button>
							<Button
								type={"button"}
								colorScheme={"purple"}
								variant={"ghost"}
								as={ReactLink}
								to={"/enter-room"}
							>
								Enter room
							</Button>
						</Stack>
					</form>
				</Box>
			</Stack>
		</Flex>
	);
};
