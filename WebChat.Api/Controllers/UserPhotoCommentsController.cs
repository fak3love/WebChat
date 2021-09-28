using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using WebChat.Application.Commands.Creates;
using WebChat.Application.Commands.Deletes;
using WebChat.Application.Commands.Updates;
using WebChat.Application.Queries;

namespace WebChat.Api.Controllers
{
    public class UserPhotoCommentsController : WebChatBaseController
    {
        [HttpGet("{photoSlug}")]
        public async Task<IActionResult> GetByPhotoSlug(string photoSlug)
        {
            int.TryParse(Request.Query["loadFrom"].FirstOrDefault(), out int loadFrom);
            var result = await Mediator.Send(new GetUserPhotoCommentsByPhotoSlugQuery(photoSlug, UserId, loadFrom));

            return result.Count == 0 ? NotFound() : Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> WriteComment([FromBody] WriteCommentCommand command)
        {
            command.ProfileId = UserId;

            var result = await Mediator.Send(command);

            return CreatedAtAction(nameof(WriteComment), result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateComment([FromBody] UpdateCommentCommand command)
        {
            command.ProfileId = UserId;

            await Mediator.Send(command);

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveComment([FromBody] DeleteCommentCommand command)
        {
            command.ProfileId = UserId;

            await Mediator.Send(command);

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> LikeComment([FromBody] LikeCommentCommand command)
        {
            command.ProfileId = UserId;

            await Mediator.Send(command);

            return CreatedAtAction(nameof(LikeComment), command);
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveLike([FromBody] RemoveLikeCommentCommand command)
        {
            command.ProfileId = UserId;

            await Mediator.Send(command);

            return Ok();
        }
    }
}
