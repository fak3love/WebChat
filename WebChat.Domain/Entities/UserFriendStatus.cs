using WebChat.Domain.Interfaces;

namespace WebChat.Domain.Entities
{
    public class UserFriendStatus : IBaseEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
