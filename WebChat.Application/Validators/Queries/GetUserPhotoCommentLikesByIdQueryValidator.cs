using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators.Queries
{
    public class GetUserPhotoCommentLikesByIdQueryValidator : AbstractValidator<GetUserPhotoCommentLikesByIdQuery>
    {
        public GetUserPhotoCommentLikesByIdQueryValidator()
        {
            RuleFor(prop => prop.CommentId).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
