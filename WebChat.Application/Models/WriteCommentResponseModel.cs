using System;

namespace WebChat.Application.Models
{
    public class WriteCommentResponseModel
    {
        public int UserId { get; set; }
        public int CommentId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Avatar { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Message { get; set; }
        public ReplyCommentModel Reply { get; set; }
    }
}
