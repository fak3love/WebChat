using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Commands.Creates
{
    public class WriteCommentCommand : IRequest
    {
        public int ProfileId { get; set; }
        public int? ReplyCommentId { get; set; }
        public string PhotoSlug { get; set; }
        public string MessageText { get; set; }
        public string MessageImageSlug { get; set; }

        public WriteCommentCommand(int profileId, int? replyCommentId, string photoSlug, string messageText, string messageImageSlug)
        {
            ProfileId = profileId;
            ReplyCommentId = replyCommentId;
            PhotoSlug = photoSlug;
            MessageText = messageText;
            MessageImageSlug = messageImageSlug;
        }

        public class Handler : IRequestHandler<WriteCommentCommand, Unit>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(WriteCommentCommand request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrWhiteSpace(request.MessageText) && string.IsNullOrWhiteSpace(request.MessageImageSlug))
                    throw new BadRequestException();

                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var userPhoto = await _context.UserPhotos.Include(prop => prop.Comments).FirstOrDefaultAsync(userPhoto => userPhoto.Slug == request.PhotoSlug, cancellationToken);

                if (userPhoto is null)
                    throw new NotFoundException(nameof(UserPhoto), request.PhotoSlug);

                if (request.ReplyCommentId.HasValue)
                {
                    var userPhotoComment = userPhoto.Comments.FirstOrDefault(comment => comment.ReplyToCommentId == request.ReplyCommentId);

                    if (userPhotoComment is null)
                        throw new NotFoundException(nameof(UserPhotoComment), request.ReplyCommentId);
                }

                var comment = new UserPhotoComment()
                {
                    MessageText = request.MessageText,
                    MessageImageSlug = request.MessageImageSlug,
                    UserProfileId = request.ProfileId,
                    UserPhotoId = userPhoto.Id,
                    ReplyToCommentId = request.ReplyCommentId
                };

                await _context.UserPhotoComments.AddAsync(comment, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}
