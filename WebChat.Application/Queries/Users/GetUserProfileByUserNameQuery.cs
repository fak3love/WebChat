using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Queries
{
    public class GetUserProfileByUserNameQuery : IRequest<GeneralUserProfileModel>
    {
        public string UserName { get; }

        public GetUserProfileByUserNameQuery(string userName)
        {
            UserName = userName;
        }

        public class Handler : IRequestHandler<GetUserProfileByUserNameQuery, GeneralUserProfileModel>
        {
            private readonly IMapper _mapper;
            private readonly WebChatContext _context;

            public Handler(WebChatContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<GeneralUserProfileModel> Handle(GetUserProfileByUserNameQuery request, CancellationToken cancellationToken)
            {
                var entity = await _context.Users.Include(prop => prop.Profile).FirstOrDefaultAsync(user => user.UserName == request.UserName, cancellationToken);

                if (entity is null)
                    throw new NotFoundException(nameof(UserProfile), request.UserName);

                var dto = _mapper.Map<GeneralUserProfileModel>(entity.Profile);

                return dto;
            }
        }
    }
}
