using WebChat.Domain.Common;

namespace WebChat.Application.Dtos
{
    public class UserPhotoCommentDto : BaseMessage
    {
        public int Id { get; set; }
        public int UserProfileId { get; set; }
        public int UserPhotoId { get; set; }
        public int? ReplyToCommentId { get; set; }
    }
}
