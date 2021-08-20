using MediatR;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Common;
using WebChat.Domain.Entities;

namespace WebChat.Application.Commands.Creates
{
    public class WriteMessageCommand : IRequest
    {
        public int ProfileId { get; set; }
        public int TargetProfileId { get; set; }
        public string MessageText { get; set; }
        public string MessageImageSlug { get; set; }

        public WriteMessageCommand(int profileId, int targetProfileId, string messageText, string messageImageSlug)
        {
            ProfileId = profileId;
            TargetProfileId = targetProfileId;
            MessageText = messageText;
            MessageImageSlug = messageImageSlug;
        }

        public class Handler : IRequestHandler<WriteMessageCommand, Unit>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(WriteMessageCommand request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrWhiteSpace(request.MessageText) && string.IsNullOrWhiteSpace(request.MessageImageSlug))
                    throw new BadRequestException();

                var message = new BaseMessage()
                {
                    MessageText = request.MessageText,
                    MessageImageSlug = request.MessageImageSlug
                };

                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                userProfile = await _context.UserProfiles.FindAsync(new object[] { request.TargetProfileId });

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.TargetProfileId);

                var userMessage = new UserMessage()
                {
                    InitiatorUserId = request.ProfileId,
                    TargetUserId = request.TargetProfileId,
                    MessageText = message.MessageText,
                    MessageImageSlug = message.MessageImageSlug
                };

                userMessage = (await _context.UserMessages.AddAsync(userMessage, cancellationToken)).Entity;
                await _context.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}
