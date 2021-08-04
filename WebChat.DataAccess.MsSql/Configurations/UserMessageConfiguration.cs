using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebChat.Domain.Entities;

namespace WebChat.DataAccess.MsSql.Configurations
{
    public class UserMessageConfiguration : IEntityTypeConfiguration<UserMessage>
    {
        public void Configure(EntityTypeBuilder<UserMessage> builder)
        {
            builder.HasKey(prop => new { prop.Id });
            builder.HasOne(prop => prop.InitiatorUser).WithMany(prop => prop.InitiatorMessages).HasForeignKey(prop => prop.InitiatorUserId);
            builder.HasOne(prop => prop.TargetUser).WithMany(prop => prop.TargetMessages).HasForeignKey(prop => prop.TargetUserId).OnDelete(DeleteBehavior.Restrict);
            builder.Property(prop => prop.MessageText).HasMaxLength(500);
            builder.Property(prop => prop.MessageImageSlug).HasMaxLength(20);
            builder.Property(prop => prop.CreatedAt).IsRequired();
        }
    }
}
