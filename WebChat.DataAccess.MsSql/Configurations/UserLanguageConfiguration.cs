using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebChat.Domain.Entities;

namespace WebChat.DataAccess.MsSql.Configurations
{
    public class UserLanguageConfiguration : IEntityTypeConfiguration<UserLanguage>
    {
        public void Configure(EntityTypeBuilder<UserLanguage> builder)
        {
            builder.HasKey(prop => new { prop.UserProfileId, prop.LanguageId });
            builder.HasOne(prop => prop.UserProfile).WithMany(prop => prop.Languages).HasForeignKey(prop => prop.UserProfileId);
            builder.HasOne(prop => prop.Language).WithMany(prop => prop.UserProfiles).HasForeignKey(prop => prop.LanguageId);
        }
    }
}
