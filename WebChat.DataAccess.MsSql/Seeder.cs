using Microsoft.EntityFrameworkCore;
using WebChat.Domain.Collections;
using WebChat.Domain.Entities;

namespace WebChat.DataAccess.MsSql
{
    public static class Seeder
    {
        public static void Seed(this ModelBuilder builder)
        {
            builder.Entity<Country>().HasData(Countries.Value);
            builder.Entity<City>().HasData(Cities.Value);
            builder.Entity<Language>().HasData(Languages.Value);
            builder.Entity<UserFriendStatus>().HasData(UserFriendStatuses.Value);
        }
    }
}
