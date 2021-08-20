using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators
{
    public class GetUserProfileByUserNameQueryValidator : AbstractValidator<GetUserProfileByUserNameQuery>
    {
        public GetUserProfileByUserNameQueryValidator()
        {
            RuleFor(prop => prop.UserName).Length(6, 20).WithMessage($"Minimum username length {6} Maximum length ${20} characters");
        }
    }
}
