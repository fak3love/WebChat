using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators
{
    public class GetChatsByProfileIdQueryValidator : AbstractValidator<GetChatsByProfileIdQuery>
    {
        public GetChatsByProfileIdQueryValidator()
        {
            RuleFor(prop => prop.Id).GreaterThan(0).WithMessage("Must be greater than 0");
        }
    }
}
