using System.Collections.Generic;
using WebChat.Application.Dtos.City;

namespace WebChat.Application.Dtos
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserStatus { get; set; }
        public UserDto User { get; set; }
        public CityDto City { get; set; }
        public UserPhotoDto Avatar { get; set; }

        public ICollection<LanguageDto> Languages { get; set; }
        public ICollection<FriendDto> Friends { get; set; }
        public ICollection<MessageDto> Messages { get; set; }
        public ICollection<UserPhotoDto> Photos { get; set; }
        public ICollection<UserPhotoLikeDto> PhotoLikes { get; set; }
        public ICollection<UserPhotoCommentDto> PhotoComments { get; set; }
        public ICollection<UserPhotoCommentLikeDto> PhotoCommentLikes { get; set; }

        public UserProfileDto()
        {
            Languages = new HashSet<LanguageDto>();
            Friends = new HashSet<FriendDto>();
            Messages = new HashSet<MessageDto>();
            Photos = new HashSet<UserPhotoDto>();
            PhotoLikes = new HashSet<UserPhotoLikeDto>();
            PhotoComments = new HashSet<UserPhotoCommentDto>();
            PhotoCommentLikes = new HashSet<UserPhotoCommentLikeDto>();
        }
    }
}
