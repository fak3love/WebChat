using System.Collections.Generic;
using WebChat.Domain.Common;

namespace WebChat.Domain.Entities
{
    public class Language : IBaseEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<UserLanguage> UserProfiles { get; private set; }

        public Language()
        {
            UserProfiles = new HashSet<UserLanguage>();
        }
    }
}
