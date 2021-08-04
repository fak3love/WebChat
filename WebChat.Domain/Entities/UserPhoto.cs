using System.Collections.Generic;
using WebChat.Domain.Common;

namespace WebChat.Domain.Entities
{
    public class UserPhoto : BasePhoto, IBaseEntity
    {
        public int Id { get; set; }
        public int UserProfileId { get; set; }

        public virtual UserProfile UserProfile { get; set; }

        public ICollection<UserPhotoLike> Likes { get; private set; }
        public ICollection<UserPhotoComment> Comments { get; private set; }

        public UserPhoto()
        {
            Likes = new HashSet<UserPhotoLike>();
            Comments = new HashSet<UserPhotoComment>();
        }
    }
}
