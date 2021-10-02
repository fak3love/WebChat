using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Queries
{
    public class GetUniqueUnreadCountMessageByProfileIdQuery : IRequest<ICollection<int>>
    {
        public int ProfileId { get; set; }

        public GetUniqueUnreadCountMessageByProfileIdQuery(int profileId)
        {
            ProfileId = profileId;
        }

        public class Handler : IRequestHandler<GetUniqueUnreadCountMessageByProfileIdQuery, ICollection<int>>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<ICollection<int>> Handle(GetUniqueUnreadCountMessageByProfileIdQuery request, CancellationToken cancellationToken)
            {
                var count = await _context.UserMessages
                    .Where(message => message.TargetUserId == request.ProfileId && !message.IsRead && !message.IsDeletedTarget)
                    .Select(prop => prop.InitiatorUserId)
                    .Distinct()
                    .ToListAsync();

                return count;
            }
        }
    }
}
