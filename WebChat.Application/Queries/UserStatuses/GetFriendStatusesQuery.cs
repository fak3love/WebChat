using AutoMapper;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Dtos;
using WebChat.Domain.Collections;

namespace WebChat.Application.Queries
{
    public class GetFriendStatusesQuery : IRequest<ICollection<FriendStatusDto>>
    {
        public class Handler : IRequestHandler<GetFriendStatusesQuery, ICollection<FriendStatusDto>>
        {
            private readonly IMapper _mapper;

            public Handler(IMapper mapper)
            {
                _mapper = mapper;
            }

            public Task<ICollection<FriendStatusDto>> Handle(GetFriendStatusesQuery request, CancellationToken cancellationToken)
            {
                var statuses = Task.FromResult(_mapper.Map<ICollection<FriendStatusDto>>(UserFriendStatuses.Values));

                return statuses;
            }
        }
    }
}
