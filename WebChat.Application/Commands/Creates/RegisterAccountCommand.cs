using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Commands.Creates
{
    public class RegisterAccountCommand : IRequest<LoginModel>
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public RegisterAccountCommand(string userName, string password, string firstName, string lastName, string email)
        {
            UserName = userName;
            Password = password;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
        }

        public class Handler : IRequestHandler<RegisterAccountCommand, LoginModel>
        {
            private readonly WebChatContext _context;
            private readonly UserManager<User> _userManager;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(WebChatContext context, UserManager<User> userManager, IJwtGenerator jwtGenerator)
            {
                _context = context;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
            }

            public async Task<LoginModel> Handle(RegisterAccountCommand request, CancellationToken cancellationToken)
            {
                var userProfile = (await _context.UserProfiles.AddAsync(new UserProfile(request.FirstName, request.LastName), cancellationToken)).Entity;
                await _context.SaveChangesAsync(cancellationToken);

                var user = new User(request.UserName, request.Email, userProfile.Id);

                var createResult = await _userManager.CreateAsync(user, request.Password);

                if (!createResult.Succeeded)
                    throw new IdentityException(createResult.Errors);

                var model = new LoginModel()
                {
                    UserName = request.UserName,
                    Token = _jwtGenerator.CreateToken(user)
                };


                return model;
            }
        }
    }
}
