using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebChat.Domain.Entities;

namespace WebChat.DataAccess.MsSql.Configurations
{
    public class CommentMessagePhotoConfiguration : IEntityTypeConfiguration<CommentMessagePhoto>
    {
        public void Configure(EntityTypeBuilder<CommentMessagePhoto> builder)
        {
            builder.HasKey(keys => new { keys.UserPhotoCommentId, keys.UserPhotoId });
            builder.HasOne(prop => prop.UserPhotoComment).WithMany(prop => prop.MessagePhotos).HasForeignKey(prop => prop.UserPhotoCommentId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(prop => prop.UserPhoto).WithMany(prop => prop.CommentMessagePhotos).HasForeignKey(prop => prop.UserPhotoId).OnDelete(DeleteBehavior.Restrict);
        }
    }
}
