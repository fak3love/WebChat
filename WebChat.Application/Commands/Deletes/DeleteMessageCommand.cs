using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Commands.Deletes
{
    public class DeleteMessageCommand : IRequest
    {
        public int ProfileId { get; set; }
        public int MessageId { get; set; }

        public DeleteMessageCommand(int profileId, int messageId)
        {
            ProfileId = profileId;
            MessageId = messageId;
        }

        public class Handler : IRequestHandler<DeleteMessageCommand, Unit>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(DeleteMessageCommand request, CancellationToken cancellationToken)
            {
                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var message = await _context.UserMessages.FindAsync(new object[] { request.MessageId }, cancellationToken);

                if (message.InitiatorUserId != request.ProfileId)
                    throw new BadRequestException();

                message.DeletedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}
