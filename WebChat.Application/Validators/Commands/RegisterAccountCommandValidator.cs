using FluentValidation;
using WebChat.Application.Commands.Creates;

namespace WebChat.Application.Validators
{
    public class RegisterAccountCommandValidator : AbstractValidator<RegisterAccountCommand>
    {
        public RegisterAccountCommandValidator()
        {
            RuleFor(prop => prop.UserName).Length(6, 20).WithMessage($"Minimum username length {6} Maximum length ${20} characters");
            RuleFor(prop => prop.Password).Length(8, 20).WithMessage($"Minimum password length {8} Maximum length ${20} characters");
            RuleFor(prop => prop.FirstName).NotEmpty().WithMessage("The field cannot be empty").MaximumLength(30).WithMessage($"Maximum field length {30} characters");
            RuleFor(prop => prop.LastName).NotEmpty().WithMessage("The field cannot be empty").MaximumLength(30).WithMessage($"Maximum field length {30} characters");
        }
    }
}
