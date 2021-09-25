using System;

namespace WebChat.Application.Models
{
    public class UserFriendModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsOnline { get; set; }
        public string Avatar { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
