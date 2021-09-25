using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators
{
    public class GetUserProfileByIdOrUserNameQueryValidator : AbstractValidator<GetUserProfileByIdWithTargetIdQuery>
    {
        public GetUserProfileByIdOrUserNameQueryValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
