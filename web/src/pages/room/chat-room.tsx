import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Stack, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Message } from "~/components/message";
import { Topbar } from "~/components/topbar";
import { useChatHub } from "~/hooks/use-chat-hub";
import { insertMessageFormSchema } from "~/schemas/chat.schemas";
import { type InsertMessageArgs, type InsertMessageData, type InsertMessageForm } from "~/types/chat.types";
import { type SelectMeData } from "~/types/user.types";
import { httpClient } from "~/utils/http-client";
import { type ProblemDetails } from "~/utils/problem-details";

export const ChatRoom = () => {
	const navigate = useNavigate();
	const { roomName } = useParams();

	const toast = useToast({ isClosable: true, position: "top" });
	const [messages, setMessages] = useState<InsertMessageData[]>([]);

	const { connection } = useChatHub(roomName ?? "", {
		onReceiveMessage: (data: InsertMessageData) => setMessages([...messages, data]),
		onSuccess: () => toast({ status: "success", title: "Successfully connected to the chat" }),
		onError: () => toast({ status: "error", title: "An error occurred while connecting to the chat" })
	});

	const selectMe = useQuery<SelectMeData, ProblemDetails>(
		"select-me",
		async () => {
			const reply = await httpClient.get<SelectMeData>("User/select-me");
			return reply.data;
		},
		{
			retry: 1,
			onError: (error) => {
				toast({ status: "error", title: error.title });
				if (error.status === 401) navigate("/sign-in");
			}
		}
	);

	const {
		register,
		handleSubmit,
		formState: { errors: errors }
	} = useForm<InsertMessageForm>({ resolver: zodResolver(insertMessageFormSchema) });

	const insertMessage = useMutation<InsertMessageData, ProblemDetails, InsertMessageArgs>(
		"insert-message",
		async (args) => {
			const reply = await httpClient.post<InsertMessageData>(`Chat/insert-message/${args.roomName}`, args.body);
			return reply.data;
		},
		{ onError: (error) => (error.status === 401 ? navigate("/sign-in") : undefined) }
	);

	return (
		<>
			<Topbar
				roomName={roomName ?? "Unknown room"}
				onLeave={() => connection?.invoke("LeaveRoom", roomName)}
			/>
			<Flex
				minHeight={"90vh"}
				background={"purple.50"}
				direction={"column"}
				alignItems={"center"}
				justifyContent={"end"}
			>
				<Flex
					height={"60vh"}
					width={"100%"}
					flexDirection={"column"}
					alignItems={"center"}
					overflowY={"auto"}
				>
					{messages.map((message) => (
						<Message
							key={message.id}
							align={selectMe.data?.id === message.user.id ? "end" : "start"}
							content={message.content}
							writer={selectMe.data?.id === message.user.id ? undefined : message.user.name}
						/>
					))}
				</Flex>
				<Box
					background={"white"}
					rounded={"lg"}
					boxShadow={"lg"}
					padding={4}
					margin={4}
					width={{ sm: "100%", md: "75%", lg: "50%" }}
				>
					<form
						action="submit"
						onSubmit={handleSubmit((form) => insertMessage.mutate({ body: form, roomName: roomName ?? "" }))}
					>
						<Stack spacing={4}>
							<FormControl isInvalid={!!errors.content}>
								<FormErrorMessage>{errors.content?.message}</FormErrorMessage>
								<FormLabel htmlFor={"content"} />
								<Input
									type={"text"}
									placeholder={"What do you want to say?"}
									{...register("content")}
								/>
							</FormControl>
							<Button
								type={"submit"}
								colorScheme={"purple"}
								variant={"solid"}
								isLoading={insertMessage.isLoading}
							>
								Send message
							</Button>
						</Stack>
					</form>
				</Box>
			</Flex>
		</>
	);
};
