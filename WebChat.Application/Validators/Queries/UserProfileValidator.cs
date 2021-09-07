using FluentValidation;
using WebChat.Domain.Entities;

namespace WebChat.Application.Validators
{
    public class UserProfileValidator : AbstractValidator<UserProfile>
    {
        public UserProfileValidator()
        {
            RuleFor(prop => prop.FirstName).NotEmpty().WithMessage("The field cannot be empty").MaximumLength(30).WithMessage($"Maximum field length {30} characters");
            RuleFor(prop => prop.LastName).NotEmpty().WithMessage("The field cannot be empty").MaximumLength(30).WithMessage($"Maximum field length {30} characters");
            RuleFor(prop => prop.StatusMessage).MaximumLength(200).WithMessage($"Maximum field length {200}");
        }
    }
}
