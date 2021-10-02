using MediatR;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WebChat.Application.Commands.Creates;
using WebChat.Application.Commands.Deletes;
using WebChat.Application.Commands.Updates;
using WebChat.Application.Common.Helpers;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Api.Hubs
{
    public class ChatHub : Hub
    {
        private readonly WebChatContext _context;
        private readonly IMediator _mediator;
        private readonly IFileManager _fileManager;

        private int UserId => int.Parse(Context.User.Claims.First(prop => prop.Type == ClaimTypes.NameIdentifier).Value);

        public ChatHub(WebChatContext context, IMediator mediator, IFileManager fileManager)
        {
            _context = context;
            _mediator = mediator;
            _fileManager = fileManager;
        }

        public async Task SendMessage(int targetId, string message, string[] attachedImages, string tmpId)
        {
            var responseModel = await _mediator.Send(new WriteMessageCommand(UserId, targetId, message, attachedImages));
            var userProfile = await _context.UserProfiles.FindAsync(UserId);
            var responseProfile = new ProfileHeaderModel()
            {
                UserId = userProfile.Id,
                FirstName = userProfile.FirstName,
                LastName = userProfile.LastName,
                LastActionDate = userProfile.LastActionDate,
                Avatar = await WebChatContextHelper.TryGetAvatarByUserId(UserId, _context, _fileManager)
            };

            await Clients.User(UserId.ToString()).SendAsync("NewMessageId", new { NewId = responseModel.MessageId, TmpId = tmpId });
            await Clients.User(targetId.ToString()).SendAsync("NewMessage", responseModel, responseProfile);
        }

        public async Task UpdateMessage(int messageId, string message, string[] attachedImages)
        {
            var responseModel = await _mediator.Send(new UpdateMessageCommand(UserId, messageId, message, attachedImages));

            await Clients.User(responseModel.TargetId.ToString()).SendAsync("UpdateMessage", responseModel);
        }

        public async Task ReadMessages(int initiatorId, int[] messageIds)
        {
            if (initiatorId == UserId)
                return;

            var response = new List<UserIdMessageIdModel>();

            for (int i = 0; i < messageIds.Length; i++)
            {
                var message = _context.UserMessages.FirstOrDefault(um => um.Id == messageIds[i] && um.TargetUserId == UserId);

                message.IsRead = true;
                response.Add(new UserIdMessageIdModel()
                {
                    UserId = message.InitiatorUserId,
                    MessageId = message.Id
                });
            }

            await _context.SaveChangesAsync();
            await Clients.Users(UserId.ToString(), initiatorId.ToString()).SendAsync("ConfirmedReadMessages", response);
        }

        public async Task BeginTyping(int targetId)
        {
            await Clients.User(targetId.ToString()).SendAsync("BeginTyping", UserId);
        }

        public async Task StopTyping(int targetId)
        {
            await Clients.User(targetId.ToString()).SendAsync("StopTyping", UserId);
        }
    }
}
