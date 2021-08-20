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
    public class AddFriendCommand : IRequest<Unit>
    {
        public int ProfileId { get; set; }
        public int TargetId { get; set; }

        public AddFriendCommand(int profileId, int targetId)
        {
            ProfileId = profileId;
            TargetId = targetId;
        }

        public class Handler : IRequestHandler<AddFriendCommand, Unit>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(AddFriendCommand request, CancellationToken cancellationToken)
            {
                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

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
                    if ((userFriend.Status.Name == UserFriendStatuses.FollowerTarget && userFriend.TargetUserId == request.ProfileId) ||
                        (userFriend.Status.Name == UserFriendStatuses.TargetFollower && userFriend.TargetUserId == request.TargetId))
                    {
                        userFriend.StatusId = UserFriendStatuses.Values.First(userFriend => userFriend.Name == UserFriendStatuses.Friends).Id;
                        await _context.SaveChangesAsync(cancellationToken);

                        return Unit.Value;
                    }

                    throw new BadRequestException();
                }

                userFriend = new UserFriend()
                {
                    InitiatorUserId = request.ProfileId,
                    TargetUserId = request.TargetId,
                    StatusId = UserFriendStatuses.Values.First(userFriend => userFriend.Name == UserFriendStatuses.FollowerTarget).Id,
                };

                await _context.UserFriends.AddAsync(userFriend, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}
