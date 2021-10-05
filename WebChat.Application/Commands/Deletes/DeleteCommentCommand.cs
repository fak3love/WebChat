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
    public class DeleteCommentCommand : IRequest
    {
        public int ProfileId { get; set; }
        public int CommentId { get; set; }
        
        public DeleteCommentCommand(int profileId, int commentId)
        {
            ProfileId = profileId;
            CommentId = commentId;
        }

        public class Handler : IRequestHandler<DeleteCommentCommand, Unit>
        {
            private readonly WebChatContext _context;
            private readonly IFileManager _fileManager;

            public Handler(WebChatContext context, IFileManager fileManager)
            {
                _context = context;
                _fileManager = fileManager;
            }

            public async Task<Unit> Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
            {
                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var comment = await _context.UserPhotoComments
                    .Include(prop => prop.MessagePhotos)
                    .ThenInclude(prop => prop.UserPhoto)
                    .FirstOrDefaultAsync(userPhotoComment => userPhotoComment.Id == request.CommentId, cancellationToken);

                if (comment is null)
                    throw new NotFoundException(nameof(UserPhotoComment), request.CommentId);

                if (comment.UserProfileId != request.ProfileId)
                    throw new BadRequestException();

                var replies = await _context.UserPhotoComments.Where(upc => upc.ReplyToCommentId == comment.Id).ToListAsync();

                for (int i = 0; i < replies.Count; i++)
                    replies[i].ReplyToCommentId = null;

                await _context.SaveChangesAsync(cancellationToken);

                _context.UserPhotoComments.Remove(comment);

                foreach (var photo in comment.MessagePhotos.Select(prop => prop.UserPhoto))
                {
                    _context.UserPhotos.Remove(photo);
                    await _fileManager.Delete(photo.Slug + ".jpg");
                }

                await _context.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}
