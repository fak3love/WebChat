using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebChat.Domain.Entities;

namespace WebChat.DataAccess.MsSql.Configurations
{
    public class UserPhotoCommentConfiguration : IEntityTypeConfiguration<UserPhotoComment>
    {
        public void Configure(EntityTypeBuilder<UserPhotoComment> builder)
        {
            builder.HasOne(prop => prop.UserProfile).WithMany(prop => prop.UserPhotoComments).HasForeignKey(prop => prop.UserProfileId);
            builder.HasOne(prop => prop.UserPhoto).WithMany(prop => prop.Comments).HasForeignKey(prop => prop.UserPhotoId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(prop => prop.ReplyToComment).WithMany(prop => prop.RepliesToComment).HasForeignKey(prop => prop.ReplyToCommentId).OnDelete(DeleteBehavior.Restrict);
            builder.Property(prop => prop.MessageText).HasMaxLength(500);
            builder.Property(prop => prop.CreatedAt).IsRequired();
        }
    }
}
