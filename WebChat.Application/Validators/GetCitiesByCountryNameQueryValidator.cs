using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators
{
    public class GetCitiesByCountryNameQueryValidator : AbstractValidator<GetCitiesByCountryNameQuery>
    {
        public GetCitiesByCountryNameQueryValidator()
        {
            RuleFor(prop => prop.CountryName).NotEmpty().WithMessage("The field cannot be empty");
        }
    }
}
