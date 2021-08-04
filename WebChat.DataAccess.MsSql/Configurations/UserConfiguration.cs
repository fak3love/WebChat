using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebChat.Domain.Entities;

namespace WebChat.DataAccess.MsSql.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.Property(prop => prop.CreatedAt).IsRequired();
            builder.HasIndex(prop => prop.ProfileId).IsUnique();
        }
    }
}
