import { HubConnectionBuilder, type HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

type Options<TData> = {
	onReceiveMessage?: (data: TData) => void;
	onSuccess?: () => void;
	onError?: () => void;
};

type ChatHub =
	| {
			connection: HubConnection;
			isSuccess: true;
			isError: false;
	  }
	| {
			connection: undefined;
			isSuccess: false;
			isError: true;
	  };

export const useChatHub = <TData>(room: string, options?: Options<TData>): ChatHub => {
	const [connection, setConnection] = useState<HubConnection>();

	const chatConnection = useQuery(
		"connect",
		async () => {
			const chatConnection = new HubConnectionBuilder().withUrl(`http://localhost:5080/Hubs/chat`).build();
			setConnection(chatConnection);

			await chatConnection.start();
			await chatConnection.invoke("JoinRoom", room);
			const data: string = await chatConnection.invoke("GetConnection");

			return data;
		},
		{
			retry: 3,
			refetchOnWindowFocus: false,
			onSuccess: options?.onSuccess,
			onError: options?.onError
		}
	);

	useEffect(() => {
		if (options?.onReceiveMessage) connection?.on("ReceiveMessage", options.onReceiveMessage);

		return () => {
			if (options?.onReceiveMessage) connection?.off("ReceiveMessage", options.onReceiveMessage);
		};
	}, [connection, options]);

	return { connection, isSuccess: chatConnection.isSuccess, isError: chatConnection.isError } as ChatHub;
};
