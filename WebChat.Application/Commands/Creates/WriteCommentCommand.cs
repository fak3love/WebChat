using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Common.Helpers;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Commands.Creates
{
    public class WriteCommentCommand : IRequest<WriteCommentResponseModel>
    {
        public int ProfileId { get; set; }
        public int? ReplyCommentId { get; set; }
        public string PhotoSlug { get; set; }
        public string MessageText { get; set; }
        public ICollection<string> MessagePhotos { get; set; }

        public WriteCommentCommand(int profileId, int? replyCommentId, string photoSlug, string messageText, ICollection<string> messagePhotos)
        {
            ProfileId = profileId;
            ReplyCommentId = replyCommentId;
            PhotoSlug = photoSlug;
            MessageText = messageText;
            MessagePhotos = messagePhotos;
        }

        public class Handler : IRequestHandler<WriteCommentCommand, WriteCommentResponseModel>
        {
            private readonly WebChatContext _context;
            private readonly IFileManager _fileManager;

            public Handler(WebChatContext context, IFileManager fileManager)
            {
                _context = context;
                _fileManager = fileManager;
            }

            public async Task<WriteCommentResponseModel> Handle(WriteCommentCommand request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrWhiteSpace(request.MessageText) && request.MessagePhotos.Count == 0)
                    throw new BadRequestException();

                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var userPhoto = await _context.UserPhotos
                    .Include(prop => prop.Comments)
                    .ThenInclude(prop => prop.UserProfile)
                    .FirstOrDefaultAsync(userPhoto => userPhoto.Slug == request.PhotoSlug, cancellationToken);

                if (userPhoto is null)
                    throw new NotFoundException(nameof(UserPhoto), request.PhotoSlug);

                UserPhotoComment replyToUserPhotoComment = null;

                if (request.ReplyCommentId.HasValue)
                {
                    replyToUserPhotoComment = userPhoto.Comments.FirstOrDefault(comment => comment.Id == request.ReplyCommentId);

                    if (replyToUserPhotoComment is null)
                        throw new NotFoundException(nameof(UserPhotoComment), request.ReplyCommentId);
                }

                var comment = new UserPhotoComment()
                {
                    MessageText = request.MessageText,
                    UserProfileId = request.ProfileId,
                    UserPhotoId = userPhoto.Id,
                    ReplyToCommentId = request.ReplyCommentId
                };

                comment = (await _context.UserPhotoComments.AddAsync(comment, cancellationToken)).Entity;
                await _context.SaveChangesAsync();

                List<string> photoSlugs = new List<string>();

                foreach (var messagePhoto in request.MessagePhotos)
                {
                    var slug = await Nanoid.Nanoid.GenerateAsync(size: 20);

                    byte[] imageBytes = Convert.FromBase64String(messagePhoto.Replace("data:image/png;base64,", ""));
                    await _context.UserPhotos.AddAsync(new UserPhoto(userProfile.Id, slug, false));
                    await _fileManager.WriteAllBytes(slug + ".jpg", imageBytes);
                    photoSlugs.Add(slug);
                }

                await _context.SaveChangesAsync(cancellationToken);

                foreach (var slug in photoSlugs)
                {
                    await _context.UserPhotoCommentMessagePhotos.AddAsync(new CommentMessagePhoto()
                    {
                        UserPhotoId = (await _context.UserPhotos.FirstAsync(photo => photo.Slug == slug)).Id,
                        UserPhotoCommentId = comment.Id
                    });
                }

                await _context.SaveChangesAsync(cancellationToken);

                var responseModel = new WriteCommentResponseModel()
                {
                    UserId = userProfile.Id,
                    CommentId = comment.Id,
                    FirstName = userProfile.FirstName,
                    LastName = userProfile.LastName,
                    Avatar = await WebChatContextHelper.TryGetAvatarByUserId(userProfile.Id, _context, _fileManager),
                    CreatedDate = comment.CreatedAt,
                    Message = comment.MessageText,
                    Reply = request.ReplyCommentId is not null ? new ReplyCommentModel()
                    {
                        UserId = replyToUserPhotoComment.UserProfileId,
                        CommentId = replyToUserPhotoComment.Id,
                        FirstName = replyToUserPhotoComment.UserProfile.FirstName
                    } : null
                };

                return responseModel;
            }
        }
    }
}
