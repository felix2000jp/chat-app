import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { SignIn } from "~/pages/sign-in.tsx";
import { SignUp } from "~/pages/sign-up.tsx";
import { Home } from "./pages/home";
import { ChatRoom } from "./pages/room/chat-room";
import { CreateRoom } from "./pages/room/create-room";
import { EnterRoom } from "./pages/room/enter-room";

const queryClient = new QueryClient();

const router = createBrowserRouter([
	{
		path: "/",
		children: [
			{
				path: "",
				element: <Home />
			},
			{
				path: ":roomName",
				element: <ChatRoom />
			},
			{
				path: "enter-room",
				element: <EnterRoom />
			},
			{
				path: "create-room",
				element: <CreateRoom />
			}
		]
	},
	{
		path: "/sign-up",
		element: <SignUp />
	},
	{
		path: "/sign-in",
		element: <SignIn />
	}
]);

export const App = () => {
	return (
		<ChakraProvider>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</ChakraProvider>
	);
};
