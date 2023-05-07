using System.Security.Claims;
using api.Context;
using api.Contracts;
using api.Hubs;
using api.Models;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;


namespace api.Controllers;

[ApiController]
[Route("[controller]")]
public class ChatController : ControllerBase
{
	private readonly IMapper _mapper;
	private readonly DataContext _dataContext;
	private readonly IHubContext<ChatHub, IChatHub> _chatContext;

	public ChatController(IMapper mapper, DataContext dataContext, IHubContext<ChatHub, IChatHub> chatContext) {
		_mapper = mapper;
		_dataContext = dataContext;
		_chatContext = chatContext;
	}


	[Authorize]
	[HttpPost("insert-message/{roomName}")]
	[ProducesResponseType(StatusCodes.Status200OK)]
	public async Task<IActionResult> InsertMessage([FromBody] InsertMessageBody body, string roomName) {
		var userIdClaim = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
		var userId = new Guid(userIdClaim);

		var user = await _dataContext.Users.FirstAsync(x => x.Id == userId);
		var room = await _dataContext.Rooms.FirstOrDefaultAsync(x => x.Name == roomName);

		if (room == null) {
			return Problem(statusCode: StatusCodes.Status404NotFound, title: "This room does not exist");
		}

		var message = new Message {
			Content = body.Content,
			User = user,
			Room = room
		};

		var messageDTO = _mapper.Map<MessageDTO>(message);
		await _chatContext.Clients.Group(roomName).ReceiveMessage(messageDTO);
		return Ok();
	}
}
