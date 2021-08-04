using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebChat.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public abstract class WebChatBaseController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??= (IMediator)HttpContext.RequestServices.GetService(typeof(IMediator));
    }
}
