using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Mvc.Infrastructure;


namespace api.Handlers;

public class PermissionMiddleware : IAuthorizationMiddlewareResultHandler
{
	private readonly AuthorizationMiddlewareResultHandler _defaultHandler = new();
	private readonly ProblemDetailsFactory _problemFactory;

	public PermissionMiddleware(ProblemDetailsFactory problemFactory) { _problemFactory = problemFactory; }


	public async Task HandleAsync(
		RequestDelegate next,
		HttpContext context,
		AuthorizationPolicy policy,
		PolicyAuthorizationResult authorizeResult
	) {
		switch (authorizeResult) {
			case { Challenged: true }: {
				var problem = _problemFactory.CreateProblemDetails(
					context,
					StatusCodes.Status401Unauthorized,
					"A permission error occurred"
				);

				context.Response.ContentType = "application/problem+json";
				context.Response.StatusCode = StatusCodes.Status401Unauthorized;
				await context.Response.WriteAsync(JsonSerializer.Serialize(problem));
				break;
			}
			case { Forbidden: true }: {
				var problem = _problemFactory.CreateProblemDetails(
					context,
					StatusCodes.Status403Forbidden,
					"A permission error occurred"
				);

				context.Response.ContentType = "application/problem+json";
				context.Response.StatusCode = StatusCodes.Status403Forbidden;
				await context.Response.WriteAsync(JsonSerializer.Serialize(problem));
				break;
			}
			default:
				await _defaultHandler.HandleAsync(next, context, policy, authorizeResult);
				break;
		}
	}
}
