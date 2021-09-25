using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators
{
    public class GetUserFriendStatusByUserIdQueryValidator : AbstractValidator<GetUserFriendStatusByUserIdQuery>
    {
        public GetUserFriendStatusByUserIdQueryValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.TargetId).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
