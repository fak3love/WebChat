using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Models;
using WebChat.Application.Validators;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Common;
using WebChat.Domain.Entities;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Commands.Updates
{
    public class UpdateMessageCommand : IRequest<UpdateMessageResponseModel>
    {
        public int ProfileId { get; set; }
        public int MessageId { get; set; }
        public string MessageText { get; set; }
        public ICollection<string> MessagePhotos { get; set; }

        public UpdateMessageCommand(int profileId, int messageId, string messageText, ICollection<string> messagePhotos)
        {
            ProfileId = profileId;
            MessageId = messageId;
            MessageText = messageText;
            MessagePhotos = messagePhotos;
        }

        public class Handler : IRequestHandler<UpdateMessageCommand, UpdateMessageResponseModel>
        {
            private readonly WebChatContext _context;
            private readonly IFileManager _fileManager;

            public Handler(WebChatContext context, IFileManager fileManager)
            {
                _context = context;
                _fileManager = fileManager;
            }

            public async Task<UpdateMessageResponseModel> Handle(UpdateMessageCommand request, CancellationToken cancellationToken)
            {
                request.MessagePhotos = request.MessagePhotos is null ? new string[0] : request.MessagePhotos;

                if (string.IsNullOrWhiteSpace(request.MessageText) && request.MessagePhotos.Count == 0)
                    throw new BadRequestException();

                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var userMessage = await _context.UserMessages.FindAsync(new object[] { request.MessageId }, cancellationToken);

                if (userMessage is null)
                    throw new NotFoundException(nameof(UserMessage), request.MessageId);

                if (userMessage.InitiatorUserId != request.ProfileId)
                    throw new BadRequestException();

                foreach (var photo in request.MessagePhotos)
                    if (!ImageValidator.IsValidImageByBase64Web(photo))
                        throw new BadRequestException();

                var userMessagePhotos = await _context.UserMessagePhotos
                    .Include(prop => prop.UserPhoto)
                    .Where(ump => ump.UserMessageId == request.MessageId)
                    .ToListAsync();

                foreach (var messagePhoto in userMessagePhotos)
                {
                    _context.UserMessagePhotos.Remove(messagePhoto);
                    await _fileManager.Delete(messagePhoto.UserPhoto.Slug + ".jpg");
                }

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

                userMessage.MessageText = request.MessageText;

                await _context.SaveChangesAsync(cancellationToken);

                var messageResponseModel = new UpdateMessageResponseModel()
                {
                    TargetId = userMessage.TargetUserId,
                    MessageId = userMessage.Id,
                    Message = request.MessageText,
                    AttachedImages = request.MessagePhotos,
                    EditedDate = DateTime.Now
                };

                return messageResponseModel;
            }
        }
    }
}
