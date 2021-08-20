using System;
using System.Collections.Generic;
using WebChat.Domain.Entities;

namespace WebChat.Domain.Collections
{
    public static class Countries
    {
        private static readonly Lazy<ICollection<Country>> _lazyCountries = new Lazy<ICollection<Country>>(() =>
        {
            return new List<Country>()
            {
                new Country()
                {
                    Id = 1,
                    Name = "Japan"
                },
                new Country()
                {
                    Id = 2,
                    Name = "Korea"
                }
            };
        }, true);

        public static ICollection<Country> Values => _lazyCountries.Value;
    }
}
