using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators
{
    public class GetPhotoBaseStringBySlugQueryValidator : AbstractValidator<GetPhotoBaseStringBySlugQuery>
    {
        public GetPhotoBaseStringBySlugQueryValidator()
        {
            RuleFor(prop => prop.PhotoSlug).Length(20, 20).WithMessage("The minimum and maximum slug length must be 20 characters");
        }
    }
}
