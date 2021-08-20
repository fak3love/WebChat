using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.DataAccess.MsSql;

namespace WebChat.Application.Queries
{
    public class GetChatsByProfileIdQuery : IRequest<ICollection<int>>
    {
        public int Id { get; set; }

        public GetChatsByProfileIdQuery(int id)
        {
            Id = id;
        }

        public class Handler : IRequestHandler<GetChatsByProfileIdQuery, ICollection<int>>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<ICollection<int>> Handle(GetChatsByProfileIdQuery request, CancellationToken cancellationToken)
            {
                var initiatorUsers = await _context.UserMessages.Where(message => message.InitiatorUserId == request.Id).Select(x => x.TargetUserId).ToListAsync(cancellationToken);
                var targetUsers = await _context.UserMessages.Where(message => message.TargetUserId == request.Id).Select(x => x.InitiatorUserId).ToListAsync(cancellationToken);

                var result = initiatorUsers.Union(targetUsers);

                return result.ToList();
            }
        }
    }
}
