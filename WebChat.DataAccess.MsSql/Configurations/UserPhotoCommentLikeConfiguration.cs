using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebChat.Domain.Entities;

namespace WebChat.DataAccess.MsSql.Configurations
{
    public class UserPhotoCommentLikeConfiguration : IEntityTypeConfiguration<UserPhotoCommentLike>
    {
        public void Configure(EntityTypeBuilder<UserPhotoCommentLike> builder)
        {
            builder.HasKey(prop => new { prop.UserProfileId, prop.UserPhotoCommentId });
            builder.HasOne(prop => prop.UserProfile).WithMany(prop => prop.UserPhotoCommentLikes).HasForeignKey(prop => prop.UserProfileId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(prop => prop.UserPhotoComment).WithMany(prop => prop.Likes).HasForeignKey(prop => prop.UserPhotoCommentId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
