using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators
{
    public class GetPhotoInfoBySlugQueryValidator : AbstractValidator<GetPhotoInfoBySlugQuery>
    {
        public GetPhotoInfoBySlugQueryValidator()
        {
            RuleFor(prop => prop.PhotoSlug).Length(20, 20).WithMessage("The minimum and maximum slug length must be 20 characters");
        }
    }
}
