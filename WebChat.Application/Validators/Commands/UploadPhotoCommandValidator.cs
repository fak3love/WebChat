using FluentValidation;
using WebChat.Application.Commands.Creates;

namespace WebChat.Application.Validators
{
    public class UploadPhotoCommandValidator : AbstractValidator<UploadPhotoCommand>
    {
        public UploadPhotoCommandValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
