using FluentValidation;
using System.Collections.Generic;
using WebChat.Application.Commands.Creates;

namespace WebChat.Application.Validators.Commands
{
    public class WriteCommentCommandValidator : AbstractValidator<WriteCommentCommand>
    {
        public WriteCommentCommandValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.ReplyCommentId).Must(BeAValidReplyCommentId).GreaterThan(0).WithMessage("Must be null or greater than 0");
            RuleFor(prop => prop.PhotoSlug).Length(20, 20).WithMessage("The minimum and maximum slug length must be 20 characters");
            RuleFor(prop => prop.MessageText).MaximumLength(500).WithMessage("Maximum field length 500 characters");
            RuleFor(prop => prop.MessagePhotos).Must(BeAMax10Photos).WithMessage("Maximum images 10");
        }

        private bool BeAValidReplyCommentId(int? id)
        {
            if (id.HasValue && id.Value <= 0)
                return false;

            return true;
        }
        private bool BeAMax10Photos(ICollection<string> messages)
        {
            return messages.Count <= 10;
        }
    }
}
