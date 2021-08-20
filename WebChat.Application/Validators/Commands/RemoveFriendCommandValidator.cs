using FluentValidation;
using WebChat.Application.Commands.Creates;

namespace WebChat.Application.Validators
{
    public class RemoveFriendCommandValidator : AbstractValidator<RemoveFriendCommand>
    {
        public RemoveFriendCommandValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.TargetId).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
