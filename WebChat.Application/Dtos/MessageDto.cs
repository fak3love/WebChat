using WebChat.Domain.Common;

namespace WebChat.Application.Dtos
{
    public class MessageDto : BaseMessage
    {
        public int Id { get; set; }
        public UserProfileDto FirstUser { get; set; }
        public UserProfileDto SecondUser { get; set; }
    }
}
