using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Common.Helpers;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Collections;
using WebChat.Domain.Entities;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Queries
{
    public class GetUserFollowersByProfileIdQuery : IRequest<ICollection<UserFriendModel>>
    {
        public int ProfileId { get; set; }

        public GetUserFollowersByProfileIdQuery(int profileId)
        {
            ProfileId = profileId;
        }

        public class Handler : IRequestHandler<GetUserFollowersByProfileIdQuery, ICollection<UserFriendModel>>
        {
            private readonly WebChatContext _context;
            private readonly IFileManager _fileManager;

            public Handler(WebChatContext context, IFileManager fileManager)
            {
                _context = context;
                _fileManager = fileManager;
            }

            public async Task<ICollection<UserFriendModel>> Handle(GetUserFollowersByProfileIdQuery request, CancellationToken cancellationToken)
            {
                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                string avatar = null;
                string avatarSlug = (await _context.UserPhotos
                    .OrderByDescending(prop => prop.CreatedAt)
                    .FirstOrDefaultAsync(photo => photo.UserProfileId == userProfile.Id && photo.IsAvatar))?.Slug;

                if (avatarSlug != null)
                {
                    var imageBytes = await _fileManager.ReadAllBytes(avatarSlug + ".jpg");
                    var photoBaseString = Convert.ToBase64String(imageBytes);
                    avatar = "data:image/png;base64, " + photoBaseString;
                }

                var raws = (await _context.UserFriends
                    .Include(prop => prop.Status)
                    .Include(prop => prop.InitiatorUser)
                    .Include(prop => prop.TargetUser)
                    .Where(userFriend =>
                        userFriend.Status.Name == UserFriendStatuses.TargetFollower && userFriend.InitiatorUserId == request.ProfileId ||
                        userFriend.Status.Name == UserFriendStatuses.FollowerTarget && userFriend.TargetUserId == request.ProfileId)
                    .Select(prop =>
                        new
                        {
                            Profile = prop.InitiatorUserId == request.ProfileId ? prop.TargetUser : prop.InitiatorUser,
                            ModifiedDate = prop.UpdatedAt.HasValue ? prop.UpdatedAt.Value : prop.CreatedAt
                        })
                    .ToListAsync(cancellationToken))
                    .OrderBy(prop => prop.Profile.FirstName)
                    .ThenBy(prop => prop.Profile.LastName);

                var friends = new List<UserFriendModel>();

                foreach (var raw in raws)
                {
                    friends.Add(new UserFriendModel()
                    {
                        Id = raw.Profile.Id,
                        FirstName = raw.Profile.FirstName,
                        LastName = raw.Profile.LastName,
                        IsOnline = DateTime.Now.AddMinutes(-5) <= raw.Profile.LastActionDate,
                        ModifiedDate = raw.ModifiedDate,
                        Avatar = await WebChatContextHelper.TryGetAvatarByUserId(raw.Profile.Id, _context, _fileManager)
                    });
                }

                return friends;
            }
        }
    }
}
