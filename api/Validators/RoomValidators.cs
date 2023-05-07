using api.Contracts;
using FluentValidation;


namespace api.Validators;

public class InsertRoomValidator : AbstractValidator<InsertRoomBody>
{
	public InsertRoomValidator() {
		RuleFor(x => x.Name)
			.NotEmpty()
			.MaximumLength(20);
	}
}
