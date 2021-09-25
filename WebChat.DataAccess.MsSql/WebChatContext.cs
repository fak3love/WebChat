using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Domain.Entities;
using WebChat.Domain.Interfaces;

namespace WebChat.DataAccess.MsSql
{
    public class WebChatContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public DbSet<Country> Countries { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<UserFriendStatus> FriendStatuses { get; set; }
        public DbSet<UserLanguage> UserLanguages { get; set; }
        public DbSet<UserFriend> UserFriends { get; set; }
        public DbSet<UserMessage> UserMessages { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<UserPhoto> UserPhotos { get; set; }
        public DbSet<UserPhotoLike> UserPhotoLikes { get; set; }
        public DbSet<UserPhotoComment> UserPhotoComments { get; set; }
        public DbSet<UserPhotoCommentLike> UserPhotoCommentLikes { get; set; }

        public WebChatContext(DbContextOptions options) : base(options)
        {
            //Database.EnsureDeleted();
            Database.EnsureCreated();
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(WebChatContext).Assembly);
            modelBuilder.Seed();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAuditable();

            return base.SaveChangesAsync(cancellationToken);
        }

        private void ApplyAuditable()
        {
            foreach (var entry in ChangeTracker.Entries<IAuditable>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.Now;
                        break;
                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.Now;
                        break;
                }
            }
        }
    }
}
