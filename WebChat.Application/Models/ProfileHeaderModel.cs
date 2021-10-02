using System;

namespace WebChat.Application.Models
{
    public class ProfileHeaderModel
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Avatar  { get; set; }
        public DateTime LastActionDate { get; set; }
    }
}
