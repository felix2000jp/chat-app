using System.Security.Claims;
using api.Context;
using api.Contracts;
using api.Models;
using MapsterMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace api.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
	private readonly IMapper _mapper;
	private readonly DataContext _dataContext;

	public UserController(IMapper mapper, DataContext dataContext) {
		_mapper = mapper;
		_dataContext = dataContext;
	}


	[HttpPost("sign-up")]
	[ProducesResponseType(typeof(UserDTO), StatusCodes.Status200OK)]
	public async Task<IActionResult> SignUpUser([FromBody] SignUpUserBody body) {
		// Verify the name does not exist.
		var user = await _dataContext.Users.FirstOrDefaultAsync(x => x.Name == body.Name);
		if (user != null) {
			return Problem(statusCode: StatusCodes.Status409Conflict, title: "Name already exists");
		}

		// Create the new user and add it to the database.
		var newUser = new User {
			Name = body.Name,
			Password = BCrypt.Net.BCrypt.HashPassword(body.Password)
		};

		await _dataContext.Users.AddAsync(newUser);
		await _dataContext.SaveChangesAsync();

		// Create the authentication cookie.
		var claims = new List<Claim> {
			new(ClaimTypes.NameIdentifier, newUser.Id.ToString()),
			new(ClaimTypes.Name, newUser.Name)
		};

		var claimsIdentity = new ClaimsIdentity(claims, "chat-auth");
		var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
		await HttpContext.SignInAsync(claimsPrincipal, new AuthenticationProperties { IsPersistent = true });

		var userDTO = _mapper.Map<UserDTO>(newUser);
		return Ok(userDTO);
	}

	[HttpPost("sign-in")]
	[ProducesResponseType(typeof(UserDTO), StatusCodes.Status200OK)]
	public async Task<IActionResult> SignInUser([FromBody] SignInUserBody body) {
		// Verify the name exists.
		var user = await _dataContext.Users.FirstOrDefaultAsync(x => x.Name == body.Name);
		if (user == null) {
			return Problem(statusCode: StatusCodes.Status400BadRequest, title: "Please check your credentials");
		}

		// Verify the password is correct.
		if (!BCrypt.Net.BCrypt.Verify(body.Password, user.Password)) {
			return Problem(statusCode: StatusCodes.Status400BadRequest, title: "Please check your credentials");
		}

		// Create the authentication cookie.
		var claims = new List<Claim> {
			new(ClaimTypes.NameIdentifier, user.Id.ToString()),
			new(ClaimTypes.Name, user.Name)
		};

		var claimsIdentity = new ClaimsIdentity(claims, "chat-auth");
		var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
		await HttpContext.SignInAsync(claimsPrincipal, new AuthenticationProperties { IsPersistent = true });

		var userDTO = _mapper.Map<UserDTO>(user);
		return Ok(userDTO);
	}

	[HttpPost("sign-out")]
	[ProducesResponseType(StatusCodes.Status200OK)]
	public async Task<IActionResult> SignOutUser() {
		var userIdClaim = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
		var userId = new Guid(userIdClaim);

		// Verify the Id belongs to an existing user.
		var user = await _dataContext.Users.FirstOrDefaultAsync(x => x.Id == userId);
		if (user == null) {
			return Problem(statusCode: StatusCodes.Status404NotFound, title: "This account does not exist");
		}

		await HttpContext.SignOutAsync("chat-auth");

		var userData = _mapper.Map<UserDTO>(user);
		return Ok(userData);
	}

	[Authorize]
	[HttpGet("select-me")]
	[ProducesResponseType(typeof(UserDTO), StatusCodes.Status200OK)]
	public async Task<IActionResult> SelectMe() {
		var userIdClaim = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
		var userId = new Guid(userIdClaim);

		// Verify the Id belongs to an existing user.
		var user = await _dataContext.Users.FirstOrDefaultAsync(x => x.Id == userId);
		if (user == null) {
			return Problem(statusCode: StatusCodes.Status401Unauthorized, title: "This account does not exist");
		}

		var userDTO = _mapper.Map<UserDTO>(user);
		return Ok(userDTO);
	}
}
