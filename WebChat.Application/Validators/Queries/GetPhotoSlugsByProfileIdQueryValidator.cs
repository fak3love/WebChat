using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators
{
    public class GetPhotoSlugsByProfileIdQueryValidator : AbstractValidator<GetPhotoSlugsByProfileIdQuery>
    {
        public GetPhotoSlugsByProfileIdQueryValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
