using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Commands.Deletes
{
    public class DeletePhotoCommand : IRequest
    {
        public int ProfileId { get; set; }
        public string PhotoSlug { get; set; }

        public DeletePhotoCommand(int profileId, string photoSlug)
        {
            ProfileId = profileId;
            PhotoSlug = photoSlug;
        }

        public class Handler : IRequestHandler<DeletePhotoCommand, Unit>
        {
            private readonly WebChatContext _context;
            private readonly IFileManager _fileManager;

            public Handler(WebChatContext context, IFileManager fileManager)
            {
                _context = context;
                _fileManager = fileManager;
            }

            public async Task<Unit> Handle(DeletePhotoCommand request, CancellationToken cancellationToken)
            {
                var profile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (profile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var userPhoto = await _context.UserPhotos
                    .Include(prop => prop.Comments)
                    .ThenInclude(prop => prop.MessagePhotos)
                    .ThenInclude(prop => prop.UserPhoto)
                    .FirstOrDefaultAsync(photo => photo.Slug == request.PhotoSlug, cancellationToken);

                if (userPhoto is null)
                    throw new NotFoundException(nameof(UserPhoto), request.PhotoSlug);

                if (userPhoto.UserProfileId != request.ProfileId)
                    throw new BadRequestException();

                foreach (var comment in userPhoto.Comments)
                {
                    _context.UserPhotoComments.Remove(comment);
                    await _context.SaveChangesAsync(cancellationToken);

                    foreach (var photo in comment.MessagePhotos.Select(prop => prop.UserPhoto))
                    {
                        _context.UserPhotos.Remove(photo);
                        await _fileManager.Delete(photo.Slug + ".jpg");
                    }

                    await _context.SaveChangesAsync(cancellationToken);
                }

                _context.UserPhotos.Remove(userPhoto);
                await _context.SaveChangesAsync(cancellationToken);
                await _fileManager.Delete(userPhoto.Slug + ".jpg");

                return Unit.Value;
            }
        }
    }
}
