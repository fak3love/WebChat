using WebChat.Domain.Common;

namespace WebChat.Domain.Entities
{
    public class UserFriend : BaseAuditable
    {
        public int InitiatorUserId { get; set; }
        public int TargetUserId { get; set; }
        public int StatusId { get; set; }

        public UserProfile InitiatorUser { get; set; }
        public UserProfile TargetUser { get; set; }
        public UserFriendStatus Status { get; set; }
    }
}
