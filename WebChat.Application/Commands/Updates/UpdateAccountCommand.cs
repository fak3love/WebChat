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
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }

        public UpdateAccountCommand(string id, string userName, string password, string email)
        {
            Id = id;
            UserName = userName;
            Password = password;
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
                var user = await _userManager.FindByIdAsync(request.Id);

                if (user is null)
                    throw new NotFoundException(nameof(User), request.Id);

                user.UserName = request.UserName;
                user.Email = request.Email;

                var identityResult = await _userManager.UpdateAsync(user);

                if (!identityResult.Succeeded)
                    throw new IdentityException(identityResult.Errors);

                identityResult = await _userManager.AddPasswordAsync(user, request.Password);

                if (!identityResult.Succeeded)
                    throw new IdentityException(identityResult.Errors);

                return Unit.Value;
            }
        }
    }
}
