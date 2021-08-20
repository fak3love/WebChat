using FluentValidation;
using WebChat.Application.Commands.Creates;

namespace WebChat.Application.Validators
{
    public class WriteMessageCommandValidator : AbstractValidator<WriteMessageCommand>
    {
        public WriteMessageCommandValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.TargetProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.MessageText).MaximumLength(500).WithMessage("Maximum field length 500 characters");
            RuleFor(prop => prop.MessageImageSlug).MaximumLength(20).WithMessage("Maximum field length 20 characters");
        }
    }
}
