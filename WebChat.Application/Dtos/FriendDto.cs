using WebChat.Domain.Common;

namespace WebChat.Application.Dtos
{
    public class FriendDto : BaseAuditable
    {
        public int InitiatorUserId { get; set; }
        public int TargetUserId { get; set; }
        public int StatusId { get; set; }
    }
}
