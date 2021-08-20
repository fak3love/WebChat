using AutoMapper;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Dtos;
using WebChat.DataAccess.MsSql;

namespace WebChat.Application.Queries
{
    public class GetChatLastMessagesByProfileIdQuery : IRequest<ICollection<MessageDto>>
    {
        public int ProfileId { get; set; }
        public int TargetProfileId { get; set; }
        public int SkipCount { get; set; }
        public int TakeCount { get; set; }
        public bool AllowDeletedMessages { get; set; }

        public GetChatLastMessagesByProfileIdQuery(int profileId, int targetProfileId, int skipCount, int takeCount, bool allowDeletedMessages)
        {
            ProfileId = profileId;
            TargetProfileId = targetProfileId;
            SkipCount = skipCount;
            TakeCount = takeCount;
            AllowDeletedMessages = allowDeletedMessages;
        }

        public class Handler : IRequestHandler<GetChatLastMessagesByProfileIdQuery, ICollection<MessageDto>>
        {
            private readonly WebChatContext _context;
            private readonly IMapper _mapper;

            public Handler(WebChatContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public Task<ICollection<MessageDto>> Handle(GetChatLastMessagesByProfileIdQuery request, CancellationToken cancellationToken)
            {
                var userMessages = _context.UserMessages
                .Where(message =>
                    (request.AllowDeletedMessages || !request.AllowDeletedMessages && !message.DeletedAt.HasValue) &&
                    (message.InitiatorUserId == request.ProfileId && message.TargetUserId == request.TargetProfileId) ||
                    (message.InitiatorUserId == request.TargetProfileId && message.TargetUserId == request.ProfileId))
                .Distinct()
                .OrderByDescending(message => message.CreatedAt)
                .AsEnumerable();

                if (request.SkipCount > 0)
                    userMessages = userMessages.Skip(request.SkipCount);

                if (request.TakeCount > 0)
                    userMessages = userMessages.Take(request.TakeCount);

                var dto = _mapper.Map<ICollection<MessageDto>>(userMessages);

                return Task.FromResult(dto);
            }
        }
    }
}
