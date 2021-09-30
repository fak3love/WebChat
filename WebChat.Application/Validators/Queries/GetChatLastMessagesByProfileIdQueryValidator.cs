using FluentValidation;
using WebChat.Application.Queries;

namespace WebChat.Application.Validators
{
    public class GetChatLastMessagesByProfileIdQueryValidator : AbstractValidator<GetChatLastMessagesByProfileIdQuery>
    {
        public GetChatLastMessagesByProfileIdQueryValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.TargetId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.LoadFrom).GreaterThan(-1).WithMessage("Must be greater than -1");
        }
    }
}
