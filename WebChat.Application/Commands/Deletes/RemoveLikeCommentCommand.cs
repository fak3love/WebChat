using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Commands.Deletes
{
    public class RemoveLikeCommentCommand : IRequest
    {
        public int ProfileId { get; set; }
        public int CommentId { get; set; }

        public RemoveLikeCommentCommand(int profileId, int commentId)
        {
            ProfileId = profileId;
            CommentId = commentId;
        }

        public class Handler : IRequestHandler<RemoveLikeCommentCommand, Unit>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(RemoveLikeCommentCommand request, CancellationToken cancellationToken)
            {
                var profile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (profile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var comment = await _context.UserPhotoComments.Include(prop => prop.Likes).FirstOrDefaultAsync(userPhotoComment => userPhotoComment.Id == request.CommentId, cancellationToken);

                if (comment is null)
                    throw new NotFoundException(nameof(UserPhotoComment), request.CommentId);

                var commentLike = comment.Likes.FirstOrDefault(like => like.UserProfileId == request.ProfileId);

                if (commentLike is null)
                    throw new BadRequestException();

                _context.UserPhotoCommentLikes.Remove(commentLike);
                await _context.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}
