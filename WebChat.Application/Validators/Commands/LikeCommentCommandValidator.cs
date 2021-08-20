using FluentValidation;
using WebChat.Application.Commands.Creates;

namespace WebChat.Application.Validators.Commands
{
    public class LikeCommentCommandValidator : AbstractValidator<LikeCommentCommand>
    {
        public LikeCommentCommandValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.CommentId).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
