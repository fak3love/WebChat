namespace WebChat.Domain.Entities
{
    public class UserPhotoCommentLike
    {
        public int UserProfileId { get; set; }
        public int UserPhotoCommentId { get; set; }

        public UserProfile UserProfile { get; set; }
        public UserPhotoComment UserPhotoComment { get; set; }
    }
}
