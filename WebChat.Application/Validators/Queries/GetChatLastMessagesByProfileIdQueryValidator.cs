using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators
{
    public class GetChatLastMessagesByProfileIdQueryValidator : AbstractValidator<GetChatLastMessagesByProfileIdQuery>
    {
        public GetChatLastMessagesByProfileIdQueryValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.TargetProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.SkipCount).GreaterThan(-1).WithMessage("Must be greater than -1");
            RuleFor(prop => prop.TakeCount).GreaterThan(-1).WithMessage("Must be greater than -1");
        }
    }
}
