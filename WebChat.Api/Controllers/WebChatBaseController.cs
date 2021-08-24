using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;

namespace WebChat.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public abstract class WebChatBaseController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??= (IMediator)HttpContext.RequestServices.GetService(typeof(IMediator));
        protected int UserId => int.Parse(User.Claims.First(prop => prop.Type == ClaimTypes.NameIdentifier).Value);
    }
}
