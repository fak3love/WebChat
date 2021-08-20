namespace WebChat.Domain.Common
{
    public class BaseMessage : BaseAuditable
    {
        public string MessageText { get; set; }
        public string MessageImageSlug { get; set; }
    }
}
