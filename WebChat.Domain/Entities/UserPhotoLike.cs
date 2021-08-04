namespace WebChat.Domain.Entities
{
    public class UserPhotoLike
    {
        public int UserProfileId { get; set; }
        public int UserPhotoId { get; set; }

        public UserProfile UserProfile { get; set; }
        public UserPhoto UserPhoto { get; set; }
    }
}
