using System.Security.Claims;
using api.Context;
using api.Contracts;
using api.Models;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace api.Controllers;

[ApiController]
[Route("[controller]")]
public class RoomController : ControllerBase
{
	private readonly IMapper _mapper;
	private readonly DataContext _dataContext;

	public RoomController(IMapper mapper, DataContext dataContext) {
		_mapper = mapper;
		_dataContext = dataContext;
	}

	[Authorize]
	[HttpPost("insert-room")]
	[ProducesResponseType(typeof(RoomDTO), StatusCodes.Status200OK)]
	public async Task<IActionResult> InsertRoom([FromBody] InsertRoomBody body) {
		var userIdClaim = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
		var userId = new Guid(userIdClaim);
		var user = await _dataContext.Users.FirstAsync(x => x.Id == userId);

		// Verify the name does not exist.
		var room = await _dataContext.Rooms.FirstOrDefaultAsync(x => x.Name == body.Name);
		if (room != null) {
			return Problem(statusCode: StatusCodes.Status409Conflict, title: "Name already exists");
		}

		// Create the new user and add it to the database.
		var newRoom = new Room {
			Name = body.Name,
			User = user
		};

		await _dataContext.Rooms.AddAsync(newRoom);
		await _dataContext.SaveChangesAsync();

		var roomDTO = _mapper.Map<RoomDTO>(newRoom);
		return Ok(roomDTO);
	}

	[Authorize]
	[HttpGet("select-room/{name}")]
	[ProducesResponseType(typeof(RoomDTO), StatusCodes.Status200OK)]
	public async Task<IActionResult> SelectRoom(string name) {
		// Verify the name does not exist.
		var room = await _dataContext.Rooms.FirstOrDefaultAsync(x => x.Name == name);
		if (room == null) {
			return Problem(statusCode: StatusCodes.Status404NotFound, title: "There is no room with that name");
		}

		var roomDTO = _mapper.Map<RoomDTO>(room);
		return Ok(roomDTO);
	}
}
