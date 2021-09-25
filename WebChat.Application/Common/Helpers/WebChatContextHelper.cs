using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Common.Helpers
{
    public static class WebChatContextHelper
    {
        public static async Task<string> TryGetPhotoBase64BySlug(string slug, IFileManager fileManager)
        {
            if (slug != null)
            {
                var imageBytes = await fileManager.ReadAllBytes(slug + ".jpg");
                var photoBaseString = Convert.ToBase64String(imageBytes);
                return "data:image/png;base64, " + photoBaseString;
            }

            return null;
        }
        public static async Task<string> TryGetAvatarByUserId(int userId, WebChatContext context, IFileManager fileManager)
        {
            string avatarSlug = (await context.UserPhotos
                .OrderByDescending(prop => prop.CreatedAt)
                .FirstOrDefaultAsync(photo => photo.UserProfileId == userId && photo.IsAvatar))?.Slug;

            return await TryGetPhotoBase64BySlug(avatarSlug, fileManager);
        }
    }
}
