using System.Collections.Generic;
using WebChat.Domain.Common;

namespace WebChat.Application.Dtos
{
    public class UserPhotoCommentDto : BaseMessage
    {
        public int Id { get; set; }
        public UserProfileDto UserProfile { get; set; }
        public UserPhotoDto UserPhoto { get; set; }
        public UserPhotoCommentDto ReplyToComment { get; set; }

        public ICollection<UserPhotoCommentDto> RepliesToComment { get; set; }
        public ICollection<UserPhotoCommentLikeDto> Likes { get; set; }

        public UserPhotoCommentDto()
        {
            RepliesToComment = new HashSet<UserPhotoCommentDto>();
            Likes = new HashSet<UserPhotoCommentLikeDto>();
        }
    }
}
