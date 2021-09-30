using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Common.Helpers;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Queries
{
    public class GetChatLastMessagesByProfileIdQuery : IRequest<ICollection<MessageModel>>
    {
        public int ProfileId { get; set; }
        public int TargetId { get; set; }
        public int LoadFrom { get; set; }

        public GetChatLastMessagesByProfileIdQuery(int profileId, int targetId, int loadFrom)
        {
            ProfileId = profileId;
            TargetId = targetId;
            LoadFrom = loadFrom;
        }

        public class Handler : IRequestHandler<GetChatLastMessagesByProfileIdQuery, ICollection<MessageModel>>
        {
            private readonly WebChatContext _context;
            private readonly IFileManager _fileManager;

            public Handler(WebChatContext context, IFileManager fileManager)
            {
                _context = context;
                _fileManager = fileManager;
            }

            public async Task<ICollection<MessageModel>> Handle(GetChatLastMessagesByProfileIdQuery request, CancellationToken cancellationToken)
            {
                var user = await _context.UserProfiles.FirstOrDefaultAsync(userProfile => userProfile.Id == request.ProfileId);

                if (user is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var target = await _context.UserProfiles.FirstOrDefaultAsync(userProfile => userProfile.Id == request.TargetId);

                if (target is null)
                    throw new NotFoundException(nameof(UserProfile), request.TargetId);

                var messages = await _context.UserMessages
                    .Include(prop => prop.MessagePhotos)
                    .ThenInclude(prop => prop.UserPhoto)
                    .Where(prop =>
                        ((prop.InitiatorUserId == request.ProfileId && prop.TargetUserId == request.TargetId) ||
                        (prop.InitiatorUserId == request.TargetId && prop.TargetUserId == request.ProfileId)) &&
                        ((!prop.IsDeletedInitiator && !prop.IsDeletedTarget) ||
                        (prop.InitiatorUserId == request.ProfileId && !prop.IsDeletedInitiator) || (prop.TargetUserId == request.ProfileId && !prop.IsDeletedTarget))
                    )
                    .OrderByDescending(prop => prop.CreatedAt)
                    .Skip(request.LoadFrom)
                    .Take(20)
                    .OrderBy(prop => prop.CreatedAt)
                    .ToListAsync();

                var messageModels = new List<MessageModel>();

                foreach (var message in messages)
                {
                    messageModels.Add(new MessageModel()
                    {
                        UserId = message.InitiatorUserId,
                        MessageId = message.Id,
                        IsRead = message.IsRead,
                        WrittenDate = message.CreatedAt,
                        EditedDate = message.UpdatedAt,
                        MessageText = message.MessageText,
                        MessageImages = await GetPhotos(message.MessagePhotos.Select(prop => prop.UserPhoto.Slug))
                    });
                }

                await ReadMessages(messages.Where(message => message.TargetUserId == request.ProfileId && !message.IsRead).ToList());

                return messageModels;
            }

            private async Task<ICollection<string>> GetPhotos(IEnumerable<string> slugs)
            {
                List<string> photos = new List<string>();

                foreach (var slug in slugs)
                    photos.Add(await WebChatContextHelper.TryGetPhotoBase64BySlug(slug, _fileManager));

                return photos;
            }
            private async Task ReadMessages(List<UserMessage> messages)
            {
                for (int i = 0; i < messages.Count; i++)
                    messages[i].IsRead = true;

                await _context.SaveChangesAsync();
            }
        }
    }
}
