using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators.Queries
{
    public class GetUserPhotoCommentRepliesByIdQueryValidator : AbstractValidator<GetUserPhotoCommentRepliesByIdQuery>
    {
        public GetUserPhotoCommentRepliesByIdQueryValidator()
        {
            RuleFor(prop => prop.CommentId).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
