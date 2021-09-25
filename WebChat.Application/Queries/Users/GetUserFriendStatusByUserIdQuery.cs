using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Dtos;
using WebChat.DataAccess.MsSql;

namespace WebChat.Application.Queries
{
    public class GetUserFriendStatusByUserIdQuery : IRequest<FriendDto>
    {
        public int ProfileId { get; set; }
        public int TargetId { get; set; }

        public GetUserFriendStatusByUserIdQuery(int profileId, int targetId)
        {
            ProfileId = profileId;
            TargetId = targetId;
        }

        public class Handler : IRequestHandler<GetUserFriendStatusByUserIdQuery, FriendDto>
        {
            private readonly WebChatContext _context;
            private readonly IMapper _mapper;

            public Handler(WebChatContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<FriendDto> Handle(GetUserFriendStatusByUserIdQuery request, CancellationToken cancellationToken)
            {
                var userFriend = await _context.UserFriends.FirstOrDefaultAsync(status =>
                    (status.InitiatorUserId == request.ProfileId && status.TargetUserId == request.TargetId) ||
                    (status.InitiatorUserId == request.TargetId && status.TargetUserId == request.ProfileId));

                if (userFriend == null)
                    return null;

                var dto = _mapper.Map<FriendDto>(userFriend);

                return dto;
            }
        }
    }
}
