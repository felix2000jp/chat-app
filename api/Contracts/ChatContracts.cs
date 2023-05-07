namespace api.Contracts;

public record InsertMessageBody
{
	public required string Content { get; set; } = string.Empty;
}
