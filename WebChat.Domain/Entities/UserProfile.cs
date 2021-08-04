using System.Collections.Generic;
using WebChat.Domain.Common;

namespace WebChat.Domain.Entities
{
    public class UserProfile : IBaseEntity
    {
        public int Id { get; set; }
        public int CityId { get; set; }
        public int? AvatarId { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserStatus { get; set; }

        public User User { get; set; }
        public City City { get; set; }
               
        public ICollection<UserLanguage> Languages { get; private set; }
        public ICollection<UserFriend> InitiatorFriends { get; private set; }
        public ICollection<UserFriend> TargetFriends { get; private set; }
        public ICollection<UserMessage> InitiatorMessages { get; private set; }
        public ICollection<UserMessage> TargetMessages { get; private set; }
        public ICollection<UserPhoto> UserPhotos { get; private set; }
        public ICollection<UserPhotoLike> UserPhotoLikes { get; private set; }
        public ICollection<UserPhotoComment> UserPhotoComments { get; private set; }
        public ICollection<UserPhotoCommentLike> UserPhotoCommentLikes { get; private set; }

        public UserProfile()
        {
            Languages = new HashSet<UserLanguage>();
            InitiatorFriends = new HashSet<UserFriend>();
            TargetFriends = new HashSet<UserFriend>();
            InitiatorMessages = new HashSet<UserMessage>();
            TargetMessages = new HashSet<UserMessage>();
            UserPhotos = new HashSet<UserPhoto>();
            UserPhotoLikes = new HashSet<UserPhotoLike>();
            UserPhotoComments = new HashSet<UserPhotoComment>();
            UserPhotoCommentLikes = new HashSet<UserPhotoCommentLike>();
        }
    }
}
