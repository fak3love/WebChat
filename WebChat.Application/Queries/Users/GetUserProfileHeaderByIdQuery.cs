using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
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
    public class GetUserProfileHeaderByIdQuery : IRequest<ProfileHeaderModel>
    {
        public int ProfileId { get; set; }

        public GetUserProfileHeaderByIdQuery(int profileId)
        {
            ProfileId = profileId;
        }

        public class Handler : IRequestHandler<GetUserProfileHeaderByIdQuery, ProfileHeaderModel>
        {
            private readonly WebChatContext _context;
            private readonly IFileManager _fileManager;

            public Handler(WebChatContext context, IFileManager fileManager)
            {
                _context = context;
                _fileManager = fileManager;
            }

            public async Task<ProfileHeaderModel> Handle(GetUserProfileHeaderByIdQuery request, CancellationToken cancellationToken)
            {
                var entity = await _context.UserProfiles.FirstOrDefaultAsync(userProfile => userProfile.Id == request.ProfileId);

                if (entity is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                string avatar = await WebChatContextHelper.TryGetAvatarByUserId(request.ProfileId, _context, _fileManager);

                var profileHeader = new ProfileHeaderModel()
                {
                    FirstName = entity.FirstName,
                    LastName = entity.LastName,
                    Avatar = avatar,
                    LastActionDate = entity.LastActionDate
                };

                return profileHeader;
            }
        }
    }
}
