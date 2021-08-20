using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators
{
    public class LoginAccountQueryValidator : AbstractValidator<LoginAccountQuery>
    {
        public LoginAccountQueryValidator()
        {
            RuleFor(prop => prop.Login).NotEmpty().WithMessage("The field cannot be empty");
            RuleFor(prop => prop.Password).Length(8, 20).WithMessage($"Minimum password length {8} Maximum length {20} characters");
        }
    }
}
