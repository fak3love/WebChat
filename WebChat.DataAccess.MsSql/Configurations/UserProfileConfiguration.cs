using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebChat.Domain.Entities;

namespace WebChat.DataAccess.MsSql.Configurations
{
    public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
    {
        public void Configure(EntityTypeBuilder<UserProfile> builder)
        {
            builder.HasKey(prop => prop.Id);
            builder.HasOne(prop => prop.User).WithOne(prop => prop.Profile).HasForeignKey<UserProfile>(prop => prop.Id);
            builder.Property(prop => prop.FirstName).HasMaxLength(30).IsRequired();
            builder.Property(prop => prop.LastName).HasMaxLength(30).IsRequired();
            builder.Property(prop => prop.StatusMessage).HasMaxLength(200);
            builder.Property(prop => prop.Gender).HasMaxLength(6);
            builder.Property(prop => prop.LastActionDate).HasDefaultValueSql("GETDATE()");
        }
    }
}
