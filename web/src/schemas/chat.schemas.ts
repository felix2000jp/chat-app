import { z } from "zod";

export const insertMessageFormSchema = z.object({
	content: z.string().nonempty("message is required").max(150, "message must be below 20 characters")
});
