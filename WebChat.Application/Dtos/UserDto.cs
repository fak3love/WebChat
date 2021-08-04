using Microsoft.AspNetCore.Identity;
using System;
using WebChat.Domain.Interfaces;

namespace WebChat.Application.Dtos
{
    public class UserDto : IdentityUser, IAuditable
    {
        public int ProfileId { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
