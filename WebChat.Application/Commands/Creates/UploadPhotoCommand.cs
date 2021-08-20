using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Commands.Creates
{
    public class UploadPhotoCommand : IRequest<string>
    {
        public int ProfileId { get; set; }
        public bool IsAvatar { get; set; }
        public string ImageBaseString { get; set; }

        public UploadPhotoCommand(int profileId, bool isAvatar, string imageBaseString)
        {
            ProfileId = profileId;
            IsAvatar = isAvatar;
            ImageBaseString = imageBaseString;
        }

        public class Handler : IRequestHandler<UploadPhotoCommand, string>
        {
            private readonly WebChatContext _context;
            private readonly IFileManager _fileManager;

            public Handler(WebChatContext context, IFileManager fileManager)
            {
                _context = context;
                _fileManager = fileManager;
            }

            public async Task<string> Handle(UploadPhotoCommand request, CancellationToken cancellationToken)
            {
                byte[] imageBytes = Convert.FromBase64String(request.ImageBaseString);

                var profile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (profile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                string slug = await Nanoid.Nanoid.GenerateAsync(size: 20);

                await _context.UserPhotos.AddAsync(new UserPhoto(request.ProfileId, slug, request.IsAvatar), cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);
                await _fileManager.WriteAllBytes(slug + ".jpg", imageBytes);

                return slug;
            }
        }
    }
}
