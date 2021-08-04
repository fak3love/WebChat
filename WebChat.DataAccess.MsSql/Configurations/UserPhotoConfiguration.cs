using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebChat.Domain.Entities;

namespace WebChat.DataAccess.MsSql.Configurations
{
    public class UserPhotoConfiguration : IEntityTypeConfiguration<UserPhoto>
    {
        public void Configure(EntityTypeBuilder<UserPhoto> builder)
        {
            builder.HasOne(prop => prop.UserProfile).WithMany(prop => prop.UserPhotos).HasForeignKey(prop => prop.UserProfileId);
            builder.Property(prop => prop.Slug).HasMaxLength(20).IsRequired();
            builder.Property(prop => prop.CreatedAt).IsRequired();
            builder.HasIndex(prop => prop.Slug).IsUnique();
        }
    }
}
