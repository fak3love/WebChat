using WebChat.Domain.Common;

namespace WebChat.Application.Dtos
{
    public class FriendDto : BaseAuditable
    {
        public UserProfileDto FirstUser { get; set; }
        public UserProfileDto SecondUser { get; set; }
        public FriendStatusDto Status { get; set; }
    }
}
