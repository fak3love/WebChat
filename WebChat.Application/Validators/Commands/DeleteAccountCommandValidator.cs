using FluentValidation;
using WebChat.Application.Commands.Deletes;

namespace WebChat.Application.Validators
{
    public class DeleteAccountCommandValidator : AbstractValidator<DeleteAccountCommand>
    {
        public DeleteAccountCommandValidator()
        {
            RuleFor(prop => prop.Id).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
