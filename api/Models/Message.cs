namespace api.Models;

public class Message
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public required string Content { get; set; }
	public required User User { get; set; }
	public required Room Room { get; set; }
}

public class MessageDTO
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public required string Content { get; set; }
	public required UserDTO User { get; set; }
	public required RoomDTO Room { get; set; }
}
