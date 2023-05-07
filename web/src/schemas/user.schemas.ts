import { z } from "zod";

export const signInFormSchema = z.object({
	name: z.string().nonempty("name is required").max(20, "name must be below 20 characters"),
	password: z.string().nonempty("password is required").max(20, "password must be below 20 characters")
});

export const signUpFormSchema = z
	.object({
		name: z.string().nonempty("name is required").max(20, "name must be below 20 characters"),
		password: z.string().nonempty("password is required").max(20, "password must be below 20 characters"),
		confirmPassword: z.string().nonempty("please confirm your password")
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "passwords do not match",
		path: ["confirmPassword"]
	});
