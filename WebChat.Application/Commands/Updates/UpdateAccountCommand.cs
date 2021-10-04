using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Domain.Entities;

namespace WebChat.Application.Commands.Updates
{
    public class UpdateAccountCommand : IRequest
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        public string Email { get; set; }

        public UpdateAccountCommand(int id, string userName, string currentPassword, string newPassword, string email)
        {
            Id = id;
            UserName = userName;
            CurrentPassword = currentPassword;
            NewPassword = newPassword;
            Email = email;
        }

        public class Handler : IRequestHandler<UpdateAccountCommand, Unit>
        {
            private readonly UserManager<User> _userManager;

            public Handler(UserManager<User> userManager)
            {
                _userManager = userManager;
            }

            public async Task<Unit> Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByIdAsync(request.Id.ToString());

                if (user is null)
                    throw new NotFoundException(nameof(User), request.Id);

                if (!string.IsNullOrWhiteSpace(request.UserName))
                    user.UserName = request.UserName;

                if (!string.IsNullOrWhiteSpace(request.Email))
                    await _userManager.SetEmailAsync(user, request.Email);

                var identityResult = await _userManager.UpdateAsync(user);

                if (!identityResult.Succeeded)
                    throw new IdentityException(identityResult.Errors);

                if (!string.IsNullOrWhiteSpace(request.CurrentPassword) && !string.IsNullOrWhiteSpace(request.NewPassword))
                    identityResult = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

                if (!identityResult.Succeeded)
                    throw new IdentityException(identityResult.Errors);

                return Unit.Value;
            }
        }
    }
}
