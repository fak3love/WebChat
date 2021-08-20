using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Dtos;
using WebChat.Domain.Entities;

namespace WebChat.Application.Queries
{
    public class GetUserByIdQuery : IRequest<UserDto>
    {
        public string Id { get; set; }

        public GetUserByIdQuery(string id)
        {
            Id = id;
        }

        public class Handler : IRequestHandler<GetUserByIdQuery, UserDto>
        {
            private readonly UserManager<User> _userManager;
            private readonly IMapper _mapper;

            public Handler(UserManager<User> userManager, IMapper mapper)
            {
                _userManager = userManager;
                _mapper = mapper;
            }

            public async Task<UserDto> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
            {
                var entity = await _userManager.FindByIdAsync(request.Id);

                if (entity is null)
                    throw new NotFoundException(nameof(UserProfile), request.Id);

                var dto = _mapper.Map<UserDto>(entity);

                return dto;
            }
        }
    }
}
