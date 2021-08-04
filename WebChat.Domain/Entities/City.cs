using System.Collections.Generic;
using WebChat.Domain.Common;

namespace WebChat.Domain.Entities
{
    public class City : IBaseEntity
    {
        public int Id { get; set; }
        public int CountryId { get; set; }
        public string Name { get; set; }

        public Country Country { get; set; }

        public ICollection<UserProfile> UserProfiles { get; private set; }

        public City()
        {
            UserProfiles = new HashSet<UserProfile>();
        }
    }
}
