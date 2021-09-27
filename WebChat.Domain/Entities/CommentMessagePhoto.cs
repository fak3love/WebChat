namespace WebChat.Domain.Entities
{
    public class CommentMessagePhoto
    {
        public int UserPhotoCommentId { get; set; }
        public int UserPhotoId { get; set; }

        public UserPhotoComment UserPhotoComment { get; set; }
        public UserPhoto UserPhoto { get; set; }
    }
}
