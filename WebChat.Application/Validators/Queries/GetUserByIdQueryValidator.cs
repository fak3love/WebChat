using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators
{
    class GetUserByIdQueryValidator : AbstractValidator<GetUserByIdQuery>
    {
        public GetUserByIdQueryValidator()
        {
            RuleFor(prop => prop.Id).MaximumLength(450).WithMessage("Field length must be 450 characters");
        }
    }
}