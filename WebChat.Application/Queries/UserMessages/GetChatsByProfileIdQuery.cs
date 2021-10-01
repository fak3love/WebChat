using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Helpers;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Queries
{
    public class GetChatsByProfileIdQuery : IRequest<ICollection<ChatModel>>
    {
        public int ProfileId { get; set; }

        public GetChatsByProfileIdQuery(int profileId)
        {
            ProfileId = profileId;
        }

        public class Handler : IRequestHandler<GetChatsByProfileIdQuery, ICollection<ChatModel>>
        {
            private readonly WebChatContext _context;
            private readonly IFileManager _fileManager;

            public Handler(WebChatContext context, IFileManager fileManager)
            {
                _context = context;
                _fileManager = fileManager;
            }

            public async Task<ICollection<ChatModel>> Handle(GetChatsByProfileIdQuery request, CancellationToken cancellationToken)
            {
                var initiatorUsers = await _context.UserMessages.Where(message => message.InitiatorUserId == request.ProfileId).Select(x => x.TargetUserId).ToListAsync(cancellationToken);
                var targetUsers = await _context.UserMessages.Where(message => message.TargetUserId == request.ProfileId).Select(x => x.InitiatorUserId).ToListAsync(cancellationToken);

                var userIds = initiatorUsers.Union(targetUsers);

                List<ChatModel> chats = new List<ChatModel>();

                foreach (var userId in userIds)
                {
                    var lastMessage = await _context.UserMessages
                        .Include(prop => prop.MessagePhotos)
                        .Where(um =>
                            (um.InitiatorUserId == request.ProfileId && um.TargetUserId == userId) ||
                            (um.InitiatorUserId == userId && um.TargetUserId == request.ProfileId)
                        )
                        .OrderByDescending(prop => prop.CreatedAt)
                        .FirstAsync();

                    var unreadMessages = await _context.UserMessages
                        .CountAsync(um =>
                            ((um.InitiatorUserId == request.ProfileId && um.TargetUserId == userId) ||
                            (um.InitiatorUserId == userId && um.TargetUserId == request.ProfileId)) &&
                            !um.IsRead
                        );

                    var profile = await _context.UserProfiles.FirstAsync(prop => prop.Id == userId);

                    var lastMessagePhotos = lastMessage.MessagePhotos.Count;
                    var lastMessageText = string.IsNullOrEmpty(lastMessage.MessageText) ? (lastMessagePhotos == 1 ? "Photo" : string.Format("{0} photos", lastMessagePhotos)): lastMessage.MessageText;

                    chats.Add(new ChatModel()
                    {
                        UserId = userId,
                        FirstName = profile.FirstName,
                        LastName = profile.LastName,
                        Avatar = await WebChatContextHelper.TryGetAvatarByUserId(userId, _context, _fileManager),
                        LastMessage = lastMessageText,
                        Sender = lastMessage.InitiatorUserId == request.ProfileId ? "user" : "target",
                        IsOnline = DateTime.Now.AddMinutes(-5) <= profile.LastActionDate,
                        WrittenDate = lastMessage.CreatedAt,
                        IsUnread = !lastMessage.IsRead,
                        UnreadCount = unreadMessages
                    });
                }

                return chats.OrderByDescending(prop => prop.WrittenDate).ToList();
            }
        }
    }
}
