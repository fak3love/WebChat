using FluentValidation;
using WebChat.Application.Commands.Updates;

namespace WebChat.Application.Validators.Commands
{
    public class UpdateCommentCommandValidator : AbstractValidator<UpdateCommentCommand>
    {
        public UpdateCommentCommandValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.CommentId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.MessageText).MaximumLength(500).WithMessage("Maximum field length 500 characters");
            RuleFor(prop => prop.MessageImageSlug).MaximumLength(20).WithMessage("Maximum field length 20 characters");
        }
    }
}
