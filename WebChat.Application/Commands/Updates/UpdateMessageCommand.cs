using MediatR;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Common;
using WebChat.Domain.Entities;

namespace WebChat.Application.Commands.Updates
{
    public class UpdateMessageCommand : IRequest
    {
        public int ProfileId { get; set; }
        public int MessageId { get; set; }
        public string MessageText { get; set; }
        public string MessageImageSlug { get; set; }

        public UpdateMessageCommand(int profileId, int messageId, string messageText, string messageImageSlug)
        {
            ProfileId = profileId;
            MessageId = messageId;
            MessageText = messageText;
            MessageImageSlug = messageImageSlug;
        }

        public class Handler : IRequestHandler<UpdateMessageCommand, Unit>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(UpdateMessageCommand request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrWhiteSpace(request.MessageText) && string.IsNullOrWhiteSpace(request.MessageImageSlug))
                    throw new BadRequestException();

                var message = new BaseMessage()
                {
                    MessageText = request.MessageText,
                };

                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var userMessage = await _context.UserMessages.FindAsync(new object[] { request.MessageId }, cancellationToken);

                if (userMessage is null)
                    throw new NotFoundException(nameof(UserMessage), request.MessageId);

                if (userMessage.InitiatorUserId != request.ProfileId)
                    throw new BadRequestException();

                userMessage.MessageText = message.MessageText;

                await _context.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}
