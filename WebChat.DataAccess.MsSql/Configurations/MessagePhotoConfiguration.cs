using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebChat.Domain.Entities;

namespace WebChat.DataAccess.MsSql.Configurations
{
    public class MessagePhotoConfiguration : IEntityTypeConfiguration<MessagePhoto>
    {
        public void Configure(EntityTypeBuilder<MessagePhoto> builder)
        {
            builder.HasKey(keys => new { keys.UserMessageId, keys.UserPhotoId });
            builder.HasOne(prop => prop.UserMessage).WithMany(prop => prop.MessagePhotos).HasForeignKey(prop => prop.UserMessageId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(prop => prop.UserPhoto).WithMany(prop => prop.MessagePhotos).HasForeignKey(prop => prop.UserPhotoId).OnDelete(DeleteBehavior.Restrict);
        }
    }
}
