using FluentValidation;
using WebChat.Application.Commands.Deletes;

namespace WebChat.Application.Validators.Commands
{
    public class DeleteCommentCommandValidator : AbstractValidator<DeleteCommentCommand>
    {
        public DeleteCommentCommandValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.CommentId).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
