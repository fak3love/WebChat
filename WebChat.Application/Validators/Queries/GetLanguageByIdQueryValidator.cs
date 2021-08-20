using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators
{
    public class GetLanguageByIdQueryValidator : AbstractValidator<GetLanguageByIdQuery>
    {
        public GetLanguageByIdQueryValidator()
        {
            RuleFor(prop => prop.Id).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
