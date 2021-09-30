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
    public class DeleteMessageHistoryCommand : IRequest
    {
        public int ProfileId { get; set; }
        public int TargetId { get; set; }

        public DeleteMessageHistoryCommand(int profileId, int targetId)
        {
            ProfileId = profileId;
            TargetId = targetId;
        }

        public class Handler : IRequestHandler<DeleteMessageHistoryCommand, Unit>
        {
            private readonly WebChatContext _context;
            private readonly IFileManager _fileManager;

            public Handler(WebChatContext context, IFileManager fileManager)
            {
                _context = context;
                _fileManager = fileManager;
            }

            public async Task<Unit> Handle(DeleteMessageHistoryCommand request, CancellationToken cancellationToken)
            {
                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var messages = await _context.UserMessages
                    .Where(prop =>
                        ((prop.InitiatorUserId == request.ProfileId && prop.TargetUserId == request.TargetId) ||
                        (prop.InitiatorUserId == request.TargetId && prop.TargetUserId == request.ProfileId)) &&
                        ((!prop.IsDeletedInitiator && !prop.IsDeletedTarget) ||
                        (prop.InitiatorUserId == request.ProfileId && !prop.IsDeletedInitiator) || (prop.TargetUserId == request.ProfileId && !prop.IsDeletedTarget))
                    )
                    .ToListAsync();

                if (messages.Count == 0)
                    throw new NotFoundException(nameof(UserMessage), $"Profile: {request.ProfileId} | Target: {request.TargetId}");

                for (int i = 0; i < messages.Count; i++)
                {
                    if (request.ProfileId == messages[i].InitiatorUserId)
                        messages[i].IsDeletedInitiator = true;

                    if (request.ProfileId == messages[i].TargetUserId)
                        messages[i].IsDeletedTarget = true;

                    if (messages[i].IsDeletedInitiator && messages[i].IsDeletedTarget)
                    {
                        var messagePhotos = await _context.UserMessagePhotos
                            .Include(prop => prop.UserPhoto)
                            .Where(ump => ump.UserMessageId == messages[i].Id)
                            .Select(prop => prop.UserPhoto.Slug)
                            .ToListAsync();

                        _context.UserMessages.Remove(messages[i]);

                        await _context.SaveChangesAsync(cancellationToken);

                        foreach (var slug in messagePhotos)
                            await _fileManager.Delete(slug + ".jpg");
                    }
                }
                
                return Unit.Value;
            }
        }
    }
}
