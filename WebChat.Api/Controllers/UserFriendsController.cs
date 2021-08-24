using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebChat.Application.Commands.Creates;
using WebChat.Application.Queries;

namespace WebChat.Api.Controllers
{
    public class UserFriendsController : WebChatBaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetFriends([FromBody] GetUserFriendsByProfileIdQuery query)
        {
            var result = await Mediator.Send(query);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetFollowers([FromBody] GetUserFollowersByProfileIdQuery query)
        {
            var result = await Mediator.Send(query);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetSubscriptions([FromBody] GetUserSubscriptionsByProfileIdQuery query)
        {
            var result = await Mediator.Send(query);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddFriend([FromBody] AddFriendCommand command)
        {
            command.ProfileId = UserId;

            await Mediator.Send(command);

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveFriend([FromBody] RemoveFriendCommand command)
        {
            command.ProfileId = UserId;

            await Mediator.Send(command);

            return Ok();
        }
    }
}
