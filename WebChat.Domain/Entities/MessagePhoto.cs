namespace WebChat.Domain.Entities
{
    public class MessagePhoto
    {
        public int UserMessageId { get; set; }
        public int UserPhotoId { get; set; }

        public UserMessage UserMessage { get; set; }
        public UserPhoto UserPhoto { get; set; }
    }
}
