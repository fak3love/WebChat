using Microsoft.AspNetCore.Identity;

namespace WebChat.Application.Dtos
{
    public class UserDto : IdentityUser
    {
        public int ProfileId { get; set; }
    }
}
