using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Collections;
using WebChat.Domain.Entities;

namespace WebChat.Application.Queries
{
    public class GetUserFriendsByProfileIdQuery : IRequest<ICollection<GeneralUserProfileModel>>
    {
        public int ProfileId { get; set; }

        public GetUserFriendsByProfileIdQuery(int profileId)
        {
            ProfileId = profileId;
        }

        public class Handler : IRequestHandler<GetUserFriendsByProfileIdQuery, ICollection<GeneralUserProfileModel>>
        {
            private readonly WebChatContext _context;
            private readonly IMapper _mapper;

            public Handler(WebChatContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<ICollection<GeneralUserProfileModel>> Handle(GetUserFriendsByProfileIdQuery request, CancellationToken cancellationToken)
            {
                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var userFriends = await _context.UserFriends
                    .Include(prop => prop.Status)
                    .Include(prop => prop.InitiatorUser)
                    .Include(prop => prop.TargetUser)
                    .Where(userFriend => 
                        userFriend.Status.Name == UserFriendStatuses.Friends &&
                        (userFriend.InitiatorUserId == request.ProfileId || userFriend.TargetUserId == request.ProfileId))
                    .Select(prop => prop.InitiatorUserId == request.ProfileId ? prop.TargetUser : prop.InitiatorUser)
                    .ToListAsync(cancellationToken);

                var dto = _mapper.Map<ICollection<GeneralUserProfileModel>>(userFriends);

                return dto;
            }
        }
    }
}
