using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebChat.Application.Commands;
using WebChat.Application.Commands.Deletes;
using WebChat.Application.Queries;

namespace WebChat.Api.Controllers
{
    public class UserLanguagesController : WebChatBaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetLanguages([FromBody] GetUserLanguagesByIdQuery query)
        {
            var result = await Mediator.Send(query);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddLanguage([FromBody] AddLanguageCommand command)
        {
            command.ProfileId = (await UserManager.FindByIdAsync(UserManager.GetUserId(User))).ProfileId;

            await Mediator.Send(command);

            return CreatedAtAction(nameof(AddLanguage), command);
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveLanguage([FromBody] DeleteLanguageCommand command)
        {
            command.ProfileId = (await UserManager.FindByIdAsync(UserManager.GetUserId(User))).ProfileId;

            await Mediator.Send(command);

            return Ok();
        }
    }
}
