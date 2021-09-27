using System.Collections.Generic;
using WebChat.Domain.Common;
using WebChat.Domain.Interfaces;

namespace WebChat.Domain.Entities
{
    public class UserPhoto : BasePhoto, IBaseEntity
    {
        public int Id { get; set; }
        public int UserProfileId { get; set; }
        public bool IsAvatar { get; set; }

        public UserProfile UserProfile { get; set; }

        public ICollection<UserPhotoLike> Likes { get; private set; }
        public ICollection<UserPhotoComment> Comments { get; private set; }

        public ICollection<MessagePhoto> MessagePhotos { get; private set; }
        public ICollection<CommentMessagePhoto> CommentMessagePhotos { get; private set; }

        public UserPhoto()
        {
            Likes = new HashSet<UserPhotoLike>();
            Comments = new HashSet<UserPhotoComment>();

            MessagePhotos = new HashSet<MessagePhoto>();
            CommentMessagePhotos = new HashSet<CommentMessagePhoto>();
        }

        public UserPhoto(int profileId, string slug, bool isAvatar) : this()
        {
            UserProfileId = profileId;
            Slug = slug;
            IsAvatar = isAvatar;
        }
    }
}
