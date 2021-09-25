using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators
{
    public class GetAvatarSlugByProfileIdQueryValidator : AbstractValidator<GetAvatarSlugByProfileIdQuery>
    {
        public GetAvatarSlugByProfileIdQueryValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
