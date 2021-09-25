using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using WebChat.Application.Commands.Creates;
using WebChat.Application.Commands.Deletes;
using WebChat.Application.Queries;

namespace WebChat.Api.Controllers
{
    public class UserPhotosController : WebChatBaseController
    {
        [HttpGet("{profileId}")]
        public async Task<IActionResult> GetAvatar(int? profileId = null)
        {
            if (profileId == null)
                profileId = UserId;

            var result = await Mediator.Send(new GetAvatarSlugByProfileIdQuery(profileId.Value));

            return result == null ? NotFound() : Ok(result);
        }

        [HttpGet("{profileId}")]
        public async Task<IActionResult> GetPhotos(int? profileId = null)
        {
            if (profileId == null)
                profileId = UserId;

            int.TryParse(Request.Query["loadFrom"].FirstOrDefault(), out int loadFrom);
            var result = await Mediator.Send(new GetPhotosByProfileIdQuery(profileId.Value, loadFrom));

            return result.Count == 0 ? NotFound() : Ok(result);
        }

        [HttpGet("{profileId}")]
        public async Task<IActionResult> GetPhotoSlugs(int? profileId = null)
        {
            if (profileId == null)
                profileId = UserId;

            var result = await Mediator.Send(new GetPhotoSlugsByProfileIdQuery(profileId.Value));

            return Ok(result);
        }

        [HttpGet("{photoSlug}")]
        public async Task<IActionResult> GetPhotoBaseString(string photoSlug)
        {
            var result = await Mediator.Send(new GetPhotoBaseStringBySlugQuery(photoSlug));

            return Ok(result);
        }

        [HttpGet("{photoSlug}")]
        public async Task<IActionResult> GetPhoto(string photoSlug)
        {
            var result = await Mediator.Send(new GetPhotoBySlugQuery(photoSlug));

            return File(result, "image/jpeg");
        }

        [HttpGet("{profileId}/{photoSlug}")]
        public async Task<IActionResult> GetPhotoInfo(int profileId, string photoSlug)
        {
            var result = await Mediator.Send(new GetPhotoInfoBySlugQuery(profileId, photoSlug));

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
            command.ProfileId = UserId;

            var slug = await Mediator.Send(command);

            return CreatedAtAction(nameof(UploadPhoto), slug);
        }

        [HttpDelete]
        public async Task<IActionResult> RemovePhoto([FromBody] DeletePhotoCommand command)
        {
            command.ProfileId = UserId;

            await Mediator.Send(command);

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> LikePhoto([FromBody] LikePhotoCommand command)
        {
            command.ProfileId = UserId;

            await Mediator.Send(command);

            return CreatedAtAction(nameof(LikePhoto), command);
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveLike([FromBody] RemoveLikePhotoCommand command)
        {
            command.ProfileId = UserId;

            await Mediator.Send(command);

            return Ok();
        }
    }
}
