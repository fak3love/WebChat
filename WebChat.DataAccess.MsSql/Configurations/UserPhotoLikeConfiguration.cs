using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebChat.Domain.Entities;

namespace WebChat.DataAccess.MsSql.Configurations
{
    public class UserPhotoLikeConfiguration : IEntityTypeConfiguration<UserPhotoLike>
    {
        public void Configure(EntityTypeBuilder<UserPhotoLike> builder)
        {
            builder.HasKey(prop => new { prop.UserProfileId, prop.UserPhotoId });
            builder.HasOne(prop => prop.UserProfile).WithMany(prop => prop.UserPhotoLikes).HasForeignKey(prop => prop.UserProfileId);
            builder.HasOne(prop => prop.UserPhoto).WithMany(prop => prop.Likes).HasForeignKey(prop => prop.UserPhotoId).OnDelete(DeleteBehavior.Restrict);
        }
    }
}
