namespace api.Models;

public record Room
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public required string Name { get; set; }
	public required User User { get; set; }
}

public record RoomDTO
{
	public Guid Id { get; set; } = Guid.Empty;
	public string Name { get; set; } = string.Empty;
}
