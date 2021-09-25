using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebChat.Application.Commands.Creates;
using WebChat.Application.Queries;

namespace WebChat.Api.Controllers
{
    public class UserFriendsController : WebChatBaseController
    {
        [HttpGet("{targetId}")]
        public async Task<IActionResult> GetStatus(int targetId)
        {
            var result = await Mediator.Send(new GetUserFriendStatusByUserIdQuery(UserId, targetId));

            return Ok(result);
        }

        [HttpGet("{profileId}")]
        public async Task<IActionResult> GetFriends(int? profileId = null)
        {
            if (profileId == null)
                profileId = UserId;

            var result = await Mediator.Send(new GetUserFriendsByProfileIdQuery(profileId.Value));

            return Ok(result);
        }
        
        [HttpGet("{profileId}")]
        public async Task<IActionResult> GetFollowers(int? profileId = null)
        {
            if (profileId == null)
                profileId = UserId;

            var result = await Mediator.Send(new GetUserFollowersByProfileIdQuery(profileId.Value));

            return Ok(result);
        }

        [HttpGet("{profileId}")]
        public async Task<IActionResult> GetSubscriptions(int? profileId = null)
        {
            if (profileId == null)
                profileId = UserId;

            var result = await Mediator.Send(new GetUserSubscriptionsByProfileIdQuery(profileId.Value));

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
