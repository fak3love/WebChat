using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebChat.Domain.Entities;

namespace WebChat.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public abstract class WebChatBaseController : ControllerBase
    {
        private IMediator _mediator;
        private UserManager<User> _userManager;

        protected IMediator Mediator => _mediator ??= (IMediator)HttpContext.RequestServices.GetService(typeof(IMediator));
        protected UserManager<User> UserManager => _userManager ??= (UserManager<User>)HttpContext.RequestServices.GetService(typeof(UserManager<User>));
    }
}
