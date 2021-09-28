using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Dtos;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Collections;
using WebChat.Domain.Entities;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application.Queries
{
    public class GetUserProfileByIdWithTargetIdQuery : IRequest<GeneralUserProfileModel>
    {
        public int ProfileId { get; set; }
        public int? TargetId { get; set; }

        public GetUserProfileByIdWithTargetIdQuery(int profileId, int? targetId)
        {
            ProfileId = profileId;
            TargetId = targetId;
        }

        public class Handler : IRequestHandler<GetUserProfileByIdWithTargetIdQuery, GeneralUserProfileModel>
        {
            private readonly WebChatContext _context;
            private readonly IFileManager _fileManager;

            public Handler(WebChatContext context, IFileManager fileManager)
            {
                _context = context;
                _fileManager = fileManager;
            }

            public async Task<GeneralUserProfileModel> Handle(GetUserProfileByIdWithTargetIdQuery request, CancellationToken cancellationToken)
            {
                UserProfile entity = await _context.UserProfiles.FirstOrDefaultAsync(userProfile => userProfile.Id == request.ProfileId);

                if (entity is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                #region Avatar
                string avatar = null;
                string avatarSlug = (await _context.UserPhotos
                    .OrderByDescending(prop => prop.CreatedAt)
                    .FirstOrDefaultAsync(photo => photo.UserProfileId == entity.Id && photo.IsAvatar))?.Slug;

                if (avatarSlug != null)
                {
                    var imageBytes = await _fileManager.ReadAllBytes(avatarSlug + ".jpg");
                    var photoBaseString = Convert.ToBase64String(imageBytes);
                    avatar = "data:image/png;base64, " + photoBaseString;
                }
                #endregion

                #region City
                var city = await _context.Cities.FindAsync(entity.CityId);
                #endregion

                #region Friends, Followers, Subsc
                var friends = await _context.UserFriends
                    .Include(prop => prop.Status)
                    .CountAsync(userFriend =>
                        userFriend.Status.Name == UserFriendStatuses.Friends &&
                        (userFriend.InitiatorUserId == entity.Id || userFriend.TargetUserId == entity.Id));
                var followers = await _context.UserFriends
                    .Include(prop => prop.Status)
                    .CountAsync(userFriend =>
                        userFriend.Status.Name == UserFriendStatuses.TargetFollower && userFriend.InitiatorUserId == entity.Id ||
                        userFriend.Status.Name == UserFriendStatuses.FollowerTarget && userFriend.TargetUserId == entity.Id);
                var subs = await _context.UserFriends
                   .Include(prop => prop.Status)
                   .CountAsync(userFriend =>
                        userFriend.Status.Name == UserFriendStatuses.FollowerTarget && userFriend.InitiatorUserId == entity.Id ||
                        userFriend.Status.Name == UserFriendStatuses.TargetFollower && userFriend.TargetUserId == entity.Id);
                #endregion

                #region Languages
                var languages = await _context.UserLanguages
                    .Include(prop => prop.Language)
                    .Where(userLanguage => userLanguage.UserProfileId == entity.Id)
                    .Select(prop => prop.Language.Name)
                    .ToListAsync();
                #endregion

                #region Photos
                var photos = await _context.UserPhotos
                    .Include(prop => prop.CommentMessagePhotos)
                    .Include(prop => prop.MessagePhotos)
                    .CountAsync(prop =>
                        prop.UserProfileId == entity.Id &&
                        prop.CommentMessagePhotos.Count == 0 &&
                        prop.MessagePhotos.Count == 0);
                #endregion

                #region FriendStatus
                var friendStatus = request.TargetId.HasValue ? await _context.UserFriends
                    .FirstOrDefaultAsync(friend =>
                        (friend.InitiatorUserId == request.ProfileId && friend.TargetUserId == request.TargetId) ||
                        (friend.InitiatorUserId == request.TargetId && friend.TargetUserId == request.ProfileId)
                    ) : null;
                #endregion

                var profile = new GeneralUserProfileModel()
                {
                    Id = entity.Id,
                    FirstName = entity.FirstName,
                    LastName = entity.LastName,
                    Gender = entity.Gender,
                    StatusMessage = entity.StatusMessage,
                    Birthday = entity.Birthday,
                    City = city?.Name,
                    Avatar = avatar,
                    AvatarSlug = avatarSlug,
                    FriendCount = friends,
                    FollowerCount = followers,
                    SubscriptionCount = subs,
                    Languages = languages,
                    PhotoCount = photos,
                    LastActionDate = entity.LastActionDate,
                    FriendStatus = friendStatus is not null ? new FriendDto()
                    {
                        InitiatorUserId = friendStatus.InitiatorUserId,
                        TargetUserId = friendStatus.TargetUserId,
                        StatusId = friendStatus.StatusId
                    } : null
                };

                return profile;
            }
        }
    }
}
