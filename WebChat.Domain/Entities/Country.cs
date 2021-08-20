using System.Collections.Generic;
using WebChat.Domain.Interfaces;

namespace WebChat.Domain.Entities
{
    public class Country : IBaseEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<City> Cities { get; private set; }

        public Country()
        {
            Cities = new HashSet<City>();
        }
    }
}
