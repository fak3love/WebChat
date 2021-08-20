using Microsoft.EntityFrameworkCore;
using WebChat.Domain.Collections;
using WebChat.Domain.Entities;

namespace WebChat.DataAccess.MsSql
{
    public static class Seeder
    {
        public static void Seed(this ModelBuilder builder)
        {
            builder.Entity<Country>().HasData(Countries.Values);
            builder.Entity<City>().HasData(Cities.Values);
            builder.Entity<Language>().HasData(Languages.Values);
            builder.Entity<UserFriendStatus>().HasData(UserFriendStatuses.Values);
        }
    }
}
