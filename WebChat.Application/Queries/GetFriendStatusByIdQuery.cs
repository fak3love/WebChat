using AutoMapper;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Dtos;
using WebChat.Domain.Collections;
using WebChat.Domain.Entities;

namespace WebChat.Application.Queries
{
    public class GetFriendStatusByIdQuery : IRequest<FriendStatusDto>
    {
        public int Id { get; set; }

        public GetFriendStatusByIdQuery(int id)
        {
            Id = id;
        }

        public class Handler : IRequestHandler<GetFriendStatusByIdQuery, FriendStatusDto>
        {
            private readonly IMapper _mapper;

            public Handler(IMapper mapper)
            {
                _mapper = mapper;
            }

            public async Task<FriendStatusDto> Handle(GetFriendStatusByIdQuery request, CancellationToken cancellationToken)
            {
                var entity = await Task.FromResult(UserFriendStatuses.Value.FirstOrDefault(status => status.Id == request.Id));

                if (entity is null)
                    throw new NotFoundException(nameof(UserFriendStatus), request.Id);

                var dto = _mapper.Map<FriendStatusDto>(entity);

                return dto;
            }
        }
    }
}
