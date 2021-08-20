using FluentValidation;
using WebChat.Application.Commands.Deletes;

namespace WebChat.Application.Validators
{
    public class DeleteAccountCommandValidator : AbstractValidator<DeleteAccountCommand>
    {
        public DeleteAccountCommandValidator()
        {
            RuleFor(prop => prop.Id).MaximumLength(450).WithMessage("Field length must be 450 characters");
        }
    }
}
