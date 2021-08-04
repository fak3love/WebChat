using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebChat.Domain.Entities;

namespace WebChat.DataAccess.MsSql.Configurations
{
    public class UserFriendConfiguration : IEntityTypeConfiguration<UserFriend>
    {
        public void Configure(EntityTypeBuilder<UserFriend> builder)
        {
            builder.HasKey(prop => new { prop.InitiatorUserId, prop.TargetUserId });
            builder.HasOne(prop => prop.InitiatorUser).WithMany(prop => prop.InitiatorFriends).HasForeignKey(prop => prop.InitiatorUserId);
            builder.HasOne(prop => prop.TargetUser).WithMany(prop => prop.TargetFriends).HasForeignKey(prop => prop.TargetUserId).OnDelete(DeleteBehavior.Restrict);
            builder.Property(prop => prop.CreatedAt).IsRequired();
        }
    }
}
