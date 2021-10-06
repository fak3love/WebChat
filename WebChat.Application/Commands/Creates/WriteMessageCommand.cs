using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Common.Helpers;
using WebChat.Application.Models;
using WebChat.Application.Validators;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Common;
using WebChat.Domain.Entities;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Commands.Creates
{
    public class WriteMessageCommand : IRequest<MessageModel>
    {
        public int ProfileId { get; set; }
        public int TargetProfileId { get; set; }
        public string MessageText { get; set; }
        public ICollection<string> MessagePhotos { get; set; }

        public WriteMessageCommand(int profileId, int targetProfileId, string messageText, ICollection<string> messagePhotos)
        {
            ProfileId = profileId;
            TargetProfileId = targetProfileId;
            MessageText = messageText;
            MessagePhotos = messagePhotos;
        }

        public class Handler : IRequestHandler<WriteMessageCommand, MessageModel>
        {
            private readonly WebChatContext _context;
            private readonly IFileManager _fileManager;

            public Handler(WebChatContext context, IFileManager fileManager)
            {
                _context = context;
                _fileManager = fileManager;
            }

            public async Task<MessageModel> Handle(WriteMessageCommand request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrWhiteSpace(request.MessageText) && request.MessagePhotos.Count == 0)
                    throw new BadRequestException();

                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var targetProfile = await _context.UserProfiles.FindAsync(new object[] { request.TargetProfileId }, cancellationToken);

                if (targetProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.TargetProfileId);

                var userMessage = new UserMessage()
                {
                    InitiatorUserId = request.ProfileId,
                    TargetUserId = request.TargetProfileId,
                    MessageText = request.MessageText,
                    IsRead = request.ProfileId == request.TargetProfileId
                };

                userMessage = (await _context.UserMessages.AddAsync(userMessage, cancellationToken)).Entity;

                List<string> photoSlugs = new List<string>();

                foreach (var messagePhoto in request.MessagePhotos)
                {
                    var slug = await Nanoid.Nanoid.GenerateAsync(size: 20);

                    byte[] imageBytes = Convert.FromBase64String(messagePhoto.Replace("data:image/png;base64,", ""));

                    await _context.UserPhotos.AddAsync(new UserPhoto(userProfile.Id, slug, false));
                    await _fileManager.WriteAllBytes(slug + ".jpg", imageBytes);
                    photoSlugs.Add(slug);
                }

                await _context.SaveChangesAsync(cancellationToken);

                foreach (var slug in photoSlugs)
                {
                    await _context.UserMessagePhotos.AddAsync(new MessagePhoto()
                    {
                        UserPhotoId = (await _context.UserPhotos.FirstAsync(photo => photo.Slug == slug)).Id,
                        UserMessageId = userMessage.Id
                    });
                }

                await _context.SaveChangesAsync(cancellationToken);

                var messageResponseModel = new MessageModel()
                {
                    UserId = request.ProfileId,
                    MessageId = userMessage.Id,
                    FirstName = userProfile.FirstName,
                    LastName = userProfile.LastName,
                    MessageText = request.MessageText,
                    MessageImages = request.MessagePhotos,
                    IsRead = request.ProfileId == request.TargetProfileId,
                    WrittenDate = DateTime.Now
                };

                return messageResponseModel;
            }
        }
    }
}
