using WebChat.Domain.Common;
using WebChat.Domain.Interfaces;

namespace WebChat.Domain.Entities
{
    public class UserMessage : BaseMessage, IBaseEntity
    {
        public int Id { get; set; }
        public int InitiatorUserId { get; set; }
        public int TargetUserId { get; set; }

        public UserProfile InitiatorUser { get; set; }
        public UserProfile TargetUser { get; set; }
    }
}
