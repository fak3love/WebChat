using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators
{
    class GetUserByIdQueryValidator : AbstractValidator<GetUserByIdQuery>
    {
        public GetUserByIdQueryValidator()
        {
            RuleFor(prop => prop.Id).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}