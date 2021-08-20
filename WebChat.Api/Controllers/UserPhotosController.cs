using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebChat.Application.Commands.Creates;
using WebChat.Application.Commands.Deletes;
using WebChat.Application.Queries;

namespace WebChat.Api.Controllers
{
    public class UserPhotosController : WebChatBaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetPhotoSlugs([FromBody] GetPhotoSlugsByProfileIdQuery query)
        {
            var result = await Mediator.Send(query);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetPhotoBaseString([FromBody] GetPhotoBaseStringBySlugQuery query)
        {
            var result = await Mediator.Send(query);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetPhotoInfo([FromBody] GetPhotoInfoBySlugQuery query)
        {
            var result = await Mediator.Send(query);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetPhotoLikes([FromBody] GetPhotoLikesBySlugQuery query)
        {
            var result = await Mediator.Send(query);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> UploadPhoto([FromBody] UploadPhotoCommand command)
        {
            command.ProfileId = (await UserManager.FindByIdAsync(UserManager.GetUserId(User))).ProfileId;

            var slug = await Mediator.Send(command);

            return CreatedAtAction(nameof(UploadPhoto), slug);
        }

        [HttpDelete]
        public async Task<IActionResult> RemovePhoto([FromBody] DeletePhotoCommand command)
        {
            command.ProfileId = (await UserManager.FindByIdAsync(UserManager.GetUserId(User))).ProfileId;

            await Mediator.Send(command);

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> LikePhoto([FromBody] LikePhotoCommand command)
        {
            command.ProfileId = (await UserManager.FindByIdAsync(UserManager.GetUserId(User))).ProfileId;

            await Mediator.Send(command);

            return CreatedAtAction(nameof(LikePhoto), command);
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveLike([FromBody] RemoveLikePhotoCommand command)
        {
            command.ProfileId = (await UserManager.FindByIdAsync(UserManager.GetUserId(User))).ProfileId;

            await Mediator.Send(command);

            return Ok();
        }
    }
}
