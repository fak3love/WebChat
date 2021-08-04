using Microsoft.AspNetCore.Identity;
using System;
using WebChat.Domain.Interfaces;

namespace WebChat.Domain.Entities
{
    public class User : IdentityUser, IAuditable
    {
        public int ProfileId { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public UserProfile Profile { get; set; }
    }
}
