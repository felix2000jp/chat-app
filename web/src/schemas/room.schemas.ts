import { z } from "zod";

export const insertRoomFormSchema = z.object({
	name: z.string().nonempty("name is required").max(20, "name must be below 20 characters")
});

export const selectRoomFormSchema = z.object({
	name: z.string().nonempty("name is required").max(20, "name must be below 20 characters")
});
