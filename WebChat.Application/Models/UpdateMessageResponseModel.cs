using System;
using System.Collections.Generic;

namespace WebChat.Application.Models
{
    public class UpdateMessageResponseModel
    {
        public int TargetId { get; set; }
        public int MessageId { get; set; }
        public string Message { get; set; }
        public DateTime EditedDate { get; set; }
        public ICollection<string> AttachedImages { get; set; }
    }
}
