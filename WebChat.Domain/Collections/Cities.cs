using System;
using System.Collections.Generic;
using WebChat.Domain.Entities;

namespace WebChat.Domain.Collections
{
    public static class Cities
    {
        private static readonly Lazy<ICollection<City>> _lazyCities = new Lazy<ICollection<City>>(() =>
        {
            return new List<City>()
            {
                new City()
                {
                    Id = 1,
                    CountryId = 1,
                    Name = "Tokyo"
                },
                new City()
                {
                    Id = 2,
                    CountryId = 1,
                    Name = "Kyoto"
                },
                new City()
                {
                    Id = 3,
                    CountryId = 2,
                    Name = "Seoul"
                },
                new City()
                {
                    Id = 4,
                    CountryId = 2,
                    Name = "Busan"
                }
            };
        }, true);

        public static ICollection<City> Value => _lazyCities.Value;
    }
}
