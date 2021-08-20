using Microsoft.AspNetCore.Identity;

namespace WebChat.Domain.Entities
{
    public class User : IdentityUser
    {
        public int ProfileId { get; set; }

        public UserProfile Profile { get; set; }

        public User() { }
        public User(string userName, string email, int profileId) : base(userName)
        {
            ProfileId = profileId;
            Email = email;
        }
    }
}
