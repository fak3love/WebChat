using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebChat.Application.Commands;
using WebChat.Application.Commands.Deletes;
using WebChat.Application.Queries;

namespace WebChat.Api.Controllers
{
    public class UserLanguagesController : WebChatBaseController
    {
        [HttpGet("{profileId}")]
        public async Task<IActionResult> GetLanguages(int? profileId = null)
        {
            if (profileId == null)
                profileId = UserId;

            var result = await Mediator.Send(new GetUserLanguagesByIdQuery(profileId.Value));

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddLanguage([FromBody] AddLanguageCommand command)
        {
            command.ProfileId = UserId;

            await Mediator.Send(command);

            return CreatedAtAction(nameof(AddLanguage), command);
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveLanguage([FromBody] DeleteLanguageCommand command)
        {
            command.ProfileId = UserId;

            await Mediator.Send(command);

            return Ok();
        }
    }
}
