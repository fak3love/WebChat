using FluentValidation;
using WebChat.Application.Commands;

namespace WebChat.Application.Validators
{
    public class AddLanguageCommandValidator : AbstractValidator<AddLanguageCommand>
    {
        public AddLanguageCommandValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.LanguageId).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
