using Microsoft.AspNetCore.Identity;
using System;
using WebChat.Domain.Interfaces;

namespace WebChat.Domain.Entities
{
    public class User : IdentityUser<int>, ILastPasswordUpdate
    {
        public UserProfile Profile { get; set; }
        public DateTime LastPasswordUpdate { get; set; }

        public User() { }
        public User(string userName, string email) : base(userName)
        {
            Email = email;
        }
    }
}
