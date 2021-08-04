using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebChat.Application.Queries;

namespace WebChat.Api.Controllers
{
    public class FriendStatusesController : WebChatBaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await Mediator.Send(new GetFriendStatusesQuery()));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await Mediator.Send(new GetFriendStatusByIdQuery(id));

            if (result is null)
                return NotFound();

            return Ok(result);
        }
    }
}
