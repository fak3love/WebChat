using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebChat.Domain.Entities;

namespace WebChat.DataAccess.MsSql.Configurations
{
    public class UserFriendStatusConfiguration : IEntityTypeConfiguration<UserFriendStatus>
    {
        public void Configure(EntityTypeBuilder<UserFriendStatus> builder)
        {
            builder.Property(prop => prop.Name).HasMaxLength(20).IsRequired();
            builder.HasIndex(prop => prop.Name).IsUnique();
        }
    }
}
