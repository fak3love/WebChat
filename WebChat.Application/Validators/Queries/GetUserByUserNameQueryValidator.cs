using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators
{
    public class GetUserByUserNameQueryValidator : AbstractValidator<GetCitiesByCountryNameQuery>
    {
        public GetUserByUserNameQueryValidator()
        {
            RuleFor(prop => prop.CountryName).Length(6, 20).WithMessage("The minimum length of the username must be 6 characters, the maximum is 20");
        }
    }
}
