using System;
using System.Collections.Generic;
using WebChat.Domain.Entities;

namespace WebChat.Domain.Collections
{
    public static class Languages
    {
        private static readonly Lazy<ICollection<Language>> _lazyLanguages = new Lazy<ICollection<Language>>(() =>
        {
            return new List<Language>()
            {
                new Language()
                {
                    Id = 1,
                    Name = "Japanese"
                },
                new Language()
                {
                    Id = 2,
                    Name = "Korean"
                },
                new Language()
                {
                    Id = 3,
                    Name = "Russian"
                },
                new Language()
                {
                    Id = 4,
                    Name = "English"
                }
            };
        }, true);

        public static ICollection<Language> Values => _lazyLanguages.Value;
    }
}
