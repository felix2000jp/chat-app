namespace api.Contracts;

public record SignUpUserBody
{
	public string Name { get; set; } = string.Empty;
	public string Password { get; set; } = string.Empty;
	public string ConfirmPassword { get; set; } = string.Empty;
}

public record SignInUserBody
{
	public string Name { get; set; } = string.Empty;
	public string Password { get; set; } = string.Empty;
}
