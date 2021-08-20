using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators.Queries
{
    public class GetUserPhotoCommentsByPhotoSlugQueryValidator : AbstractValidator<GetUserPhotoCommentsByPhotoSlugQuery>
    {
        public GetUserPhotoCommentsByPhotoSlugQueryValidator()
        {
            RuleFor(prop => prop.PhotoSlug).Length(20, 20).WithMessage("The minimum and maximum slug length must be 20 characters");
        }
    }
}
