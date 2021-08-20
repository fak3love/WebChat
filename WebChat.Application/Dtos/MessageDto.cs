using WebChat.Domain.Common;

namespace WebChat.Application.Dtos
{
    public class MessageDto : BaseMessage
    {
        public int Id { get; set; }
        public int FirstUserId { get; set; }
        public int SecondUserId { get; set; }
    }
}
