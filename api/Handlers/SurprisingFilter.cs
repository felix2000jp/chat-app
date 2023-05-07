using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;


namespace api.Handlers;

public class SurprisingFilter : IExceptionFilter
{
	private readonly ProblemDetailsFactory _problemFactory;

	public SurprisingFilter(ProblemDetailsFactory problemFactory) { _problemFactory = problemFactory; }


	public void OnException(ExceptionContext context) {
		var problem = _problemFactory.CreateProblemDetails(
			context.HttpContext,
			StatusCodes.Status500InternalServerError,
			"A surprising error occurred"
		);

		context.Result = new ObjectResult(problem) {
			StatusCode = StatusCodes.Status500InternalServerError
		};
	}
}
