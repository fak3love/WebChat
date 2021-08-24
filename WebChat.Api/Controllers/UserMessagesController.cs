using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebChat.Application.Commands.Creates;
using WebChat.Application.Commands.Deletes;
using WebChat.Application.Commands.Updates;
using WebChat.Application.Queries;

namespace WebChat.Api.Controllers
{
    public class UserMessagesController : WebChatBaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetChats()
        {
            var profileId = UserId;

            var result = await Mediator.Send(new GetChatsByProfileIdQuery(profileId));

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetChatLastMessages([FromBody] GetChatLastMessagesByProfileIdQuery query)
        {
            query.ProfileId = UserId;

            var result = await Mediator.Send(query);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> WriteMessage([FromBody] WriteMessageCommand command)
        {
            command.ProfileId = UserId;

            await Mediator.Send(command);

            return CreatedAtAction(nameof(WriteMessage), command);
        }

        [HttpPatch]
        public async Task<IActionResult> UpdateMessage([FromBody] UpdateMessageCommand command)
        {
            command.ProfileId = UserId;

            await Mediator.Send(command);

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> DeleteMessage([FromBody] DeleteMessageCommand command)
        {
            command.ProfileId = UserId;

            await Mediator.Send(command);

            return Ok();
        }
    }
}
