using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Collections;
using WebChat.Domain.Entities;

namespace WebChat.Application.Commands.Creates
{
    public class RemoveFriendCommand : IRequest<Unit>
    {
        public int ProfileId { get; set; }
        public int TargetId { get; set; }

        public RemoveFriendCommand(int profileId, int targetId)
        {
            ProfileId = profileId;
            TargetId = targetId;
        }

        public class Handler : IRequestHandler<RemoveFriendCommand, Unit>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(RemoveFriendCommand request, CancellationToken cancellationToken)
            {
                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                userProfile = await _context.UserProfiles.FindAsync(new object[] { request.TargetId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.TargetId);

                var userFriend = await _context.UserFriends
                    .Include(prop => prop.Status)
                    .FirstOrDefaultAsync(userFriend =>
                    (userFriend.InitiatorUserId == request.ProfileId && userFriend.TargetUserId == request.TargetId) ||
                    (userFriend.InitiatorUserId == request.TargetId && userFriend.TargetUserId == request.ProfileId),
                    cancellationToken
                );

                if (userFriend is not null)
                {
                    if (userFriend.Status.Name == UserFriendStatuses.Friends)
                    {
                        if (userFriend.InitiatorUserId == request.ProfileId)
                            userFriend.StatusId = UserFriendStatuses.Values.First(userFriend => userFriend.Name == UserFriendStatuses.TargetFollower).Id;
                        else
                            userFriend.StatusId = UserFriendStatuses.Values.First(userFriend => userFriend.Name == UserFriendStatuses.FollowerTarget).Id;

                        await _context.SaveChangesAsync(cancellationToken);
                        return Unit.Value;
                    }
                    else if (userFriend.Status.Name == UserFriendStatuses.FollowerTarget && userFriend.InitiatorUserId == request.ProfileId)
                    {
                        _context.UserFriends.Remove(userFriend);

                        await _context.SaveChangesAsync(cancellationToken);
                        return Unit.Value;
                    }
                }

                throw new BadRequestException();
            }
        }
    }
}
