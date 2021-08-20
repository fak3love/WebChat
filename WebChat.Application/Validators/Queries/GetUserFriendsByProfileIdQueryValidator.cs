using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators
{
    public class GetUserFriendsByProfileIdQueryValidator : AbstractValidator<GetUserFriendsByProfileIdQuery>
    {
        public GetUserFriendsByProfileIdQueryValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
