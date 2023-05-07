import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Stack, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link as ReactLink, useNavigate } from "react-router-dom";
import { signInFormSchema } from "~/schemas/user.schemas";
import { type SignInArgs, type SignInData, type SignInForm } from "~/types/user.types";
import { httpClient } from "~/utils/http-client";
import { type ProblemDetails } from "~/utils/problem-details";

export const SignIn = () => {
	const navigate = useNavigate();
	const toast = useToast({ isClosable: true, position: "top" });

	const {
		register,
		handleSubmit,
		formState: { errors: errors }
	} = useForm<SignInForm>({ resolver: zodResolver(signInFormSchema) });

	const signIn = useMutation<SignInData, ProblemDetails, SignInArgs>(
		"sign-in",
		async (args) => {
			const reply = await httpClient.post<SignInData>("User/sign-in", args.body);
			return reply.data;
		},
		{
			onSuccess: () => {
				toast({ status: "success", title: "You were successfully signed in" });
				navigate("/");
			},
			onError: (error) => {
				toast({ status: "error", title: error.title });
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
				<Heading>Sign in to your account</Heading>

				<Box
					background={"white"}
					rounded={"lg"}
					boxShadow={"lg"}
					padding={6}
				>
					<form
						action={"submit"}
						onSubmit={handleSubmit((form) => signIn.mutate({ body: form }))}
					>
						<Stack spacing={6}>
							<FormControl isInvalid={!!errors.name}>
								<FormLabel htmlFor={"name"}>Name</FormLabel>
								<Input
									type={"text"}
									placeholder={"John Doe"}
									{...register("name")}
								/>
								<FormErrorMessage>{errors.name?.message}</FormErrorMessage>
							</FormControl>
							<FormControl isInvalid={!!errors.password}>
								<FormLabel htmlFor={"password"}>Password</FormLabel>
								<Input
									type={"password"}
									placeholder={"********"}
									{...register("password")}
								/>
								<FormErrorMessage>{errors.password?.message}</FormErrorMessage>
							</FormControl>
							<Button
								type={"submit"}
								colorScheme={"purple"}
								variant={"solid"}
								isLoading={signIn.isLoading}
							>
								Sign in
							</Button>
							<Button
								type={"button"}
								colorScheme={"purple"}
								variant={"outline"}
								as={ReactLink}
								to={"/sign-up"}
							>
								Sign up
							</Button>
						</Stack>
					</form>
				</Box>
			</Stack>
		</Flex>
	);
};
