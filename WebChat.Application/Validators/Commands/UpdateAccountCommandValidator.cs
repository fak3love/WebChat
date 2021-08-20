using FluentValidation;
using WebChat.Application.Commands.Updates;

namespace WebChat.Application.Validators
{
    public class UpdateAccountCommandValidator : AbstractValidator<UpdateAccountCommand>
    {
        public UpdateAccountCommandValidator()
        {
            RuleFor(prop => prop.Id).MaximumLength(450).WithMessage("Field length must be 450 characters");
            RuleFor(prop => prop.UserName).Length(6, 20).WithMessage($"Minimum username length {6} Maximum length ${20} characters");
            RuleFor(prop => prop.Password).Length(8, 20).WithMessage($"Minimum password length {8} Maximum length ${20} characters");
        }
    }
}
