namespace api.Models;

public record User
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public required string Name { get; set; }
	public required string Password { get; set; }
	public List<Room> Rooms { get; set; } = new();
}

public record UserDTO
{
	public Guid Id { get; set; } = Guid.Empty;
	public string Name { get; set; } = string.Empty;
}
