using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebChat.Application.Commands.Updates;
using WebChat.Application.Queries;
using WebChat.Domain.Entities;

namespace WebChat.Api.Controllers
{
    public class UserProfilesController : WebChatBaseController
    {
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await Mediator.Send(new GetUserProfileByIdQuery(UserId));

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await Mediator.Send(new GetUserProfilesQuery());

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await Mediator.Send(new GetUserProfileByIdQuery(id));

            return Ok(result);
        }

        [HttpGet("{userName}")]
        public async Task<IActionResult> GetByUserName(string userName)
        {
            var result = await Mediator.Send(new GetUserProfileByUserNameQuery(userName));

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateUserProfileCommand command)
        {
            command.Id = UserId;

            await Mediator.Send(command);

            return Ok();
        }

        [HttpPatch]
        public async Task<IActionResult> Patch([FromBody] JsonPatchDocument<UserProfile> jsonPatch)
        {
            await Mediator.Send(new PatchUserProfileCommand(UserId, jsonPatch));

            return Ok();
        }
    }
}
