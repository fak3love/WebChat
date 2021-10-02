using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Commands.Deletes
{
    public class DeleteMessageCommand : IRequest<Unit>
    {
        public int ProfileId { get; set; }
        public int TargetId { get; set; }
        public int[] MessageIds { get; set; }

        public DeleteMessageCommand(int profileId, int targetId, int[] messageIds)
        {
            ProfileId = profileId;
            TargetId = targetId;
            MessageIds = messageIds;
        }

        public class Handler : IRequestHandler<DeleteMessageCommand, Unit>
        {
            private readonly WebChatContext _context;
            private readonly IFileManager _fileManager;

            public Handler(WebChatContext context, IFileManager fileManager)
            {
                _context = context;
                _fileManager = fileManager;
            }

            public async Task<Unit> Handle(DeleteMessageCommand request, CancellationToken cancellationToken)
            {
                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var tmpMessages = await _context.UserMessages
                    .Where(prop =>
                        ((prop.InitiatorUserId == request.ProfileId && prop.TargetUserId == request.TargetId) ||
                        (prop.InitiatorUserId == request.TargetId && prop.TargetUserId == request.ProfileId)) &&
                        ((!prop.IsDeletedInitiator && !prop.IsDeletedTarget) ||
                        (prop.InitiatorUserId == request.ProfileId && !prop.IsDeletedInitiator) || (prop.TargetUserId == request.ProfileId && !prop.IsDeletedTarget))
                    )
                    .ToListAsync();

                var messages = new List<UserMessage>();

                foreach (var message in tmpMessages)
                    for (int i = 0; i < request.MessageIds.Length; i++)
                        if (message.Id == request.MessageIds[i])
                            messages.Add(message);

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
                            .Select(prop => prop.UserPhoto)
                            .ToListAsync();

                        _context.UserMessages.Remove(messages[i]);
                        await _context.SaveChangesAsync(cancellationToken);

                        foreach (var photo in messagePhotos)
                        {
                            _context.UserPhotos.Remove(photo);
                            await _fileManager.Delete(photo.Slug + ".jpg");
                        }

                        await _context.SaveChangesAsync(cancellationToken);
                    }
                }

                return Unit.Value;
            }
        }
    }
}
