using FluentValidation;
using WebChat.Application.Commands.Deletes;

namespace WebChat.Application.Validators
{
    public class DeleteLanguageCommandValidator : AbstractValidator<DeleteLanguageCommand>
    {
        public DeleteLanguageCommandValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.LanguageId).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
