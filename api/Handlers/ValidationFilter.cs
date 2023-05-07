using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;


namespace api.Handlers;

public class ValidationFilter : IActionFilter
{
	private readonly ProblemDetailsFactory _problemFactory;

	public ValidationFilter(ProblemDetailsFactory problemFactory) { _problemFactory = problemFactory; }


	public void OnActionExecuting(ActionExecutingContext context) {
		if (context.ModelState.IsValid) { return; }

		var problem = _problemFactory.CreateValidationProblemDetails(
			context.HttpContext,
			context.ModelState,
			StatusCodes.Status400BadRequest,
			"A validation error occurred"
		);

		context.Result = new ObjectResult(problem) {
			StatusCode = StatusCodes.Status400BadRequest
		};
	}

	public void OnActionExecuted(ActionExecutedContext context) { }
}
