using api.Models;
using Microsoft.AspNetCore.SignalR;


namespace api.Hubs;

public interface IChatHub
{
	Task ReceiveMessage(MessageDTO message);
}

public class ChatHub : Hub<IChatHub>
{
	public string GetConnection() { return Context.ConnectionId; }

	public Task JoinRoom(string roomName) { return Groups.AddToGroupAsync(Context.ConnectionId, roomName); }

	public Task LeaveRoom(string roomName) { return Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName); }
}
