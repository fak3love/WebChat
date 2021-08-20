using FluentValidation;
using WebChat.Application.Commands.Creates;

namespace WebChat.Application.Validators.Commands
{
    public class LikePhotoCommandValidator : AbstractValidator<LikePhotoCommand>
    {
        public LikePhotoCommandValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.PhotoSlug).Length(20, 20).WithMessage("The minimum and maximum slug length must be 20 characters");
        }
    }
}
