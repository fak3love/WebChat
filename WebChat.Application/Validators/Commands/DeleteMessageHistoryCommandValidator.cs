using FluentValidation;
using WebChat.Application.Commands.Deletes;

namespace WebChat.Application.Validators.Commands
{
    public class DeleteMessageHistoryCommandValidator : AbstractValidator<DeleteMessageHistoryCommand>
    {
        public DeleteMessageHistoryCommandValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.TargetId).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
