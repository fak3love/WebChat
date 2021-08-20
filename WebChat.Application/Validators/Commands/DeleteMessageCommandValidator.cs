using FluentValidation;
using WebChat.Application.Commands.Deletes;

namespace WebChat.Application.Validators
{
    public class DeleteMessageCommandValidator : AbstractValidator<DeleteMessageCommand>
    {
        public DeleteMessageCommandValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.MessageId).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
