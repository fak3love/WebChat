using System.Collections.Generic;
using WebChat.Domain.Common;

namespace WebChat.Application.Dtos
{
    public class UserPhotoDto : BasePhoto
    {
        public int Id { get; set; }
        public UserProfileDto UserProfile { get; set; }

        public ICollection<UserPhotoLikeDto> Likes { get; set; }
        public ICollection<UserPhotoCommentDto> Comments { get; set; }

        public UserPhotoDto()
        {
            Likes = new HashSet<UserPhotoLikeDto>();
            Comments = new HashSet<UserPhotoCommentDto>();
        }
    }
}
