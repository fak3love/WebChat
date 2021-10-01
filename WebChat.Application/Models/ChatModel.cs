using System;

namespace WebChat.Application.Models
{
    public class ChatModel
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Avatar { get; set; }
        public string LastMessage { get; set; }
        public string Sender { get; set; }
        public bool IsOnline { get; set; }
        public bool IsUnread { get; set; }
        public int UnreadCount { get; set; }
        public DateTime WrittenDate { get; set; }
    }
}
