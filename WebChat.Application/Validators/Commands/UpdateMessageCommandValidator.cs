using FluentValidation;
using System.Collections.Generic;
using WebChat.Application.Commands.Updates;

namespace WebChat.Application.Validators
{
    public class UpdateMessageCommandValidator : AbstractValidator<UpdateMessageCommand>
    {
        public UpdateMessageCommandValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.MessageId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.MessageText).MaximumLength(500).WithMessage("Maximum field length 500 characters");
            RuleFor(prop => prop.MessagePhotos).Must(BeAMax10Photos).WithMessage("Maximum images 10");
        }

        private bool BeAMax10Photos(ICollection<string> messages)
        {
            return messages.Count <= 10;
        }
    }
}
