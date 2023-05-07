using api.Contracts;
using FluentValidation;


namespace api.Validators;

public class SignUpUserValidator : AbstractValidator<SignUpUserBody>
{
	public SignUpUserValidator() {
		RuleFor(x => x.Name)
			.NotEmpty()
			.MaximumLength(20);

		RuleFor(x => x.Password)
			.NotEmpty()
			.MaximumLength(20);

		RuleFor(x => x.ConfirmPassword).Equal(x => x.Password);
	}
}

public class SignInUserValidator : AbstractValidator<SignInUserBody>
{
	public SignInUserValidator() {
		RuleFor(x => x.Name)
			.NotEmpty()
			.MaximumLength(20);

		RuleFor(x => x.Password)
			.NotEmpty()
			.MaximumLength(20);
	}
}
