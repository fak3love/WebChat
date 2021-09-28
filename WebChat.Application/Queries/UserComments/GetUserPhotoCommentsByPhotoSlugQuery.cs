using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Common.Helpers;
using WebChat.Application.Dtos;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Queries
{
    public class GetUserPhotoCommentsByPhotoSlugQuery : IRequest<ICollection<PhotoCommentModel>>
    {
        public string PhotoSlug { get; set; }
        public int ProfileId { get; set; }
        public int LoadFrom { get; set; }

        public GetUserPhotoCommentsByPhotoSlugQuery(string photoSlug, int profileId, int loadFrom)
        {
            PhotoSlug = photoSlug;
            ProfileId = profileId;
            LoadFrom = loadFrom;
        }

        public class Handler : IRequestHandler<GetUserPhotoCommentsByPhotoSlugQuery, ICollection<PhotoCommentModel>>
        {
            private readonly WebChatContext _context;
            private readonly IFileManager _fileManager;

            public Handler(WebChatContext context, IFileManager fileManager)
            {
                _context = context;
                _fileManager = fileManager;
            }

            public async Task<ICollection<PhotoCommentModel>> Handle(GetUserPhotoCommentsByPhotoSlugQuery request, CancellationToken cancellationToken)
            {
                var userPhoto = await _context.UserPhotos.FirstOrDefaultAsync(userPhoto => userPhoto.Slug == request.PhotoSlug);

                if (userPhoto is null)
                    throw new NotFoundException(nameof(UserPhoto), request.PhotoSlug);

                var comments = await _context.UserPhotoComments
                    .Include(prop => prop.UserProfile)
                    .Include(prop => prop.Likes)
                    .Include(prop => prop.MessagePhotos)
                    .ThenInclude(prop => prop.UserPhoto)
                    .Include(prop => prop.ReplyToComment)
                    .ThenInclude(prop => prop.UserProfile)
                    .Where(prop => prop.UserPhotoId == userPhoto.Id)
                    .OrderBy(prop => prop.CreatedAt)
                    .Skip(request.LoadFrom)
                    .Take(20)
                    .ToListAsync();

                var commentModels = new List<PhotoCommentModel>();

                foreach (var comment in comments)
                {
                    commentModels.Add(new PhotoCommentModel()
                    {
                        UserId = comment.UserProfileId,
                        CommentId = comment.Id,
                        FirstName = comment.UserProfile.FirstName,
                        LastName = comment.UserProfile.LastName,
                        Avatar = await WebChatContextHelper.TryGetAvatarByUserId(comment.UserProfileId, _context, _fileManager),
                        CreatedDate = comment.CreatedAt,
                        Likes = comment.Likes.Count,
                        Liked = comment.Likes.FirstOrDefault(prop => prop.UserProfileId == request.ProfileId) != null,
                        Message = comment.MessageText,
                        AttachedImages = await GetMessagePhotos(comment.MessagePhotos.Select(prop => prop.UserPhoto.Slug)),
                        Reply = comment.ReplyToComment is not null ? new ReplyCommentModel()
                        {
                            UserId = comment.ReplyToComment.UserProfileId,
                            CommentId = comment.ReplyToComment.Id,
                            FirstName = comment.ReplyToComment.UserProfile.FirstName
                        } : null
                    });
                }
                
                return commentModels;
            }

            private async Task<ICollection<string>> GetMessagePhotos(IEnumerable<string> slugs)
            {
                List<string> photos = new List<string>();

                foreach (var slug in slugs)
                    photos.Add(await WebChatContextHelper.TryGetPhotoBase64BySlug(slug, _fileManager));

                return photos;
            }
        }
    }
}
