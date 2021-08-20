using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebChat.Application.Commands.Creates;
using WebChat.Application.Commands.Deletes;
using WebChat.Application.Commands.Updates;
using WebChat.Application.Queries;

namespace WebChat.Api.Controllers
{
    public class UserPhotoCommentsController : WebChatBaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetByPhotoSlug([FromBody] GetUserPhotoCommentsByPhotoSlugQuery query)
        {
            var result = await Mediator.Send(query);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetRepliesById([FromBody] GetUserPhotoCommentRepliesByIdQuery query)
        {
            var result = await Mediator.Send(query);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetCommentLikesById([FromBody] GetUserPhotoCommentLikesByIdQuery query)
        {
            var result = await Mediator.Send(query);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> WriteComment([FromBody] WriteCommentCommand command)
        {
            command.ProfileId = (await UserManager.FindByIdAsync(UserManager.GetUserId(User))).ProfileId;

            await Mediator.Send(command);

            return CreatedAtAction(nameof(WriteComment), command);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateComment([FromBody] UpdateCommentCommand command)
        {
            command.ProfileId = (await UserManager.FindByIdAsync(UserManager.GetUserId(User))).ProfileId;

            await Mediator.Send(command);

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteComment([FromBody] DeleteCommentCommand command)
        {
            command.ProfileId = (await UserManager.FindByIdAsync(UserManager.GetUserId(User))).ProfileId;

            await Mediator.Send(command);

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> LikeComment([FromBody] LikeCommentCommand command)
        {
            command.ProfileId = (await UserManager.FindByIdAsync(UserManager.GetUserId(User))).ProfileId;

            await Mediator.Send(command);

            return CreatedAtAction(nameof(LikeComment), command);
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveLikeComment([FromBody] RemoveLikeCommentCommand command)
        {
            command.ProfileId = (await UserManager.FindByIdAsync(UserManager.GetUserId(User))).ProfileId;

            await Mediator.Send(command);

            return Ok();
        }
    }
}
