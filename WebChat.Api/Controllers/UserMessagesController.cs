using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using WebChat.Application.Commands.Creates;
using WebChat.Application.Commands.Deletes;
using WebChat.Application.Commands.Updates;
using WebChat.Application.Queries;

namespace WebChat.Api.Controllers
{
    public class UserMessagesController : WebChatBaseController
    {
        [HttpGet("{targetId?}")]
        public async Task<IActionResult> Get(int targetId)
        {
            int.TryParse(Request.Query["loadFrom"].FirstOrDefault(), out int loadFrom);
            var result = await Mediator.Send(new GetChatLastMessagesByProfileIdQuery(UserId, targetId, loadFrom));

            return result.Count == 0 ? NotFound() : Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetChats()
        {
            var profileId = UserId;

            var result = await Mediator.Send(new GetChatsByProfileIdQuery(profileId));

            return result.Count == 0 ? NotFound() : Ok(result);
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

        [HttpDelete]
        public async Task<IActionResult> DeleteMessage([FromBody] DeleteMessageCommand command)
        {
            command.ProfileId = UserId;

            await Mediator.Send(command);

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteMessageHistory([FromBody] DeleteMessageHistoryCommand command)
        {
            command.ProfileId = UserId;

            await Mediator.Send(command);

            return Ok();
        }
    }
}
