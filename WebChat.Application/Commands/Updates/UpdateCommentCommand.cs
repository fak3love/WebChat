using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Commands.Updates
{
    public class UpdateCommentCommand : IRequest
    {
        public int ProfileId { get; set; }
        public int CommentId { get; set; }
        public string MessageText { get; set; }
        public string MessageImageSlug { get; set; }

        public UpdateCommentCommand(int profileId, int commentId, string messageText, string messageImageSlug)
        {
            ProfileId = profileId;
            CommentId = commentId;
            MessageText = messageText;
            MessageImageSlug = messageImageSlug;
        }

        public class Handler : IRequestHandler<UpdateCommentCommand, Unit>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrWhiteSpace(request.MessageText) && string.IsNullOrWhiteSpace(request.MessageImageSlug))
                    throw new BadRequestException();

                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var comment = await _context.UserPhotoComments.FirstOrDefaultAsync(userPhotoComment => userPhotoComment.Id == request.CommentId, cancellationToken);

                if (comment is null)
                    throw new NotFoundException(nameof(UserPhotoComment), request.CommentId);

                comment.MessageText = request.MessageText;
                comment.MessageImageSlug = request.MessageImageSlug;

                await _context.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}
