using System;
using System.Collections.Generic;

namespace WebChat.Application.Models
{
    public class MessageModel
    {
        public int UserId { get; set; }
        public int MessageId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MessageText { get; set; }
        public bool IsRead { get; set; }
        public DateTime WrittenDate { get; set; }
        public DateTime? EditedDate { get; set; }
        public ICollection<string> MessageImages { get; set; }
    }
}
