using FluentValidation;
using WebChat.Application.Commands.Deletes;

namespace WebChat.Application.Validators.Commands
{
    public class RemoveLikePhotoCommandValidator : AbstractValidator<RemoveLikePhotoCommand>
    {
        public RemoveLikePhotoCommandValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.PhotoSlug).Length(20, 20).WithMessage("The minimum and maximum slug length must be 20 characters");
        }
    }
}
