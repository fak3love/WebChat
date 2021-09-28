using System;
using System.Collections.Generic;

namespace WebChat.Application.Models
{
    public class PhotoCommentModel
    {
        public int CommentId { get; set; }
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Avatar { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Likes { get; set; }
        public bool Liked { get; set; }
        public string Message { get; set; }
        public ICollection<string> AttachedImages { get; set; }
        public ReplyCommentModel Reply { get; set; }
    }
}
