using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Models;
using WebChat.Domain.Entities;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Queries
{
    public class LoginAccountQuery : IRequest<LoginModel>
    {
        public string Login { get; set; }
        public string Password { get; set; }

		public class LoginHandler : IRequestHandler<LoginAccountQuery, LoginModel>
		{
			private readonly UserManager<User> _userManager;
			private readonly SignInManager<User> _signInManager;
            private readonly IJwtGenerator _jwtGenerator;

            public LoginHandler(UserManager<User> userManager, SignInManager<User> signInManager, IJwtGenerator jwtGenerator)
			{
				_userManager = userManager;
				_signInManager = signInManager;
                _jwtGenerator = jwtGenerator;
            }

			public async Task<LoginModel> Handle(LoginAccountQuery request, CancellationToken cancellationToken)
			{
				var user = await _userManager.FindByNameAsync(request.Login) ?? await _userManager.FindByEmailAsync(request.Login);

				if (user is null)
					throw new AuthorizationException(request.Login);

				var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

				if (!result.Succeeded)
					throw new AuthorizationException(result);

				var model = new LoginModel()
				{
					UserName = user.UserName,
					Token = _jwtGenerator.CreateToken(user)
				};

				return model;
			}
		}
	}
}
