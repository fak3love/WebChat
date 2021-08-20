using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

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

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
            {
                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var comment = await _context.UserPhotoComments.FirstOrDefaultAsync(userPhotoComment => userPhotoComment.Id == request.CommentId, cancellationToken);

                if (comment is null)
                    throw new NotFoundException(nameof(UserPhotoComment), request.CommentId);

                if (comment.UserProfileId != request.ProfileId)
                    throw new BadRequestException();

                _context.UserPhotoComments.Remove(comment);
                await _context.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}
