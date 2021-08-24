using Microsoft.AspNetCore.Identity;

namespace WebChat.Domain.Entities
{
    public class User : IdentityUser<int>
    {
        public UserProfile Profile { get; set; }

        public User() { }
        public User(string userName, string email) : base(userName)
        {
            Email = email;
        }
    }
}
