using System.Collections.Generic;
using WebChat.Domain.Common;
using WebChat.Domain.Interfaces;

namespace WebChat.Domain.Entities
{
    public class UserMessage : BaseMessage, IBaseEntity
    {
        public int Id { get; set; }
        public int InitiatorUserId { get; set; }
        public int TargetUserId { get; set; }
        public bool IsRead { get; set; }
        public bool IsDeletedInitiator { get; set; }
        public bool IsDeletedTarget { get; set; }

        public UserProfile InitiatorUser { get; set; }
        public UserProfile TargetUser { get; set; }

        public ICollection<MessagePhoto> MessagePhotos { get; set; }

        public UserMessage()
        {
            MessagePhotos = new HashSet<MessagePhoto>();
        }
    }
}
