using WebChat.Domain.Common;

namespace WebChat.Application.Dtos
{
    public class UserPhotoDto : BasePhoto
    {
        public int Id { get; set; }
        public int UserProfileId { get; set; }
        public bool IsAvatar { get; set; }
    }
}
