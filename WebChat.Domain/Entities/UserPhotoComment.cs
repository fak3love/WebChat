using System.Collections.Generic;
using WebChat.Domain.Common;
using WebChat.Domain.Interfaces;

namespace WebChat.Domain.Entities
{
    public class UserPhotoComment : BaseMessage, IBaseEntity
    {
        public int Id { get; set; }
        public int UserProfileId { get; set; }
        public int UserPhotoId { get; set; }
        public int? ReplyToCommentId { get; set; }

        public UserProfile UserProfile { get; set; }
        public UserPhoto UserPhoto { get; set; }
        public UserPhotoComment ReplyToComment { get; set; }

        public ICollection<UserPhotoComment> RepliesToComment { get; private set; }
        public ICollection<UserPhotoCommentLike> Likes { get; private set; }

        public UserPhotoComment()
        {
            RepliesToComment = new HashSet<UserPhotoComment>();
            Likes = new HashSet<UserPhotoCommentLike>();
        }
    }
}
