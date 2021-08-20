using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;

namespace WebChat.Application.Queries
{
    public class GetUserProfilesQuery : IRequest<ICollection<GeneralUserProfileModel>>
    {
        public class Handler : IRequestHandler<GetUserProfilesQuery, ICollection<GeneralUserProfileModel>>
        {
            private readonly WebChatContext _context;
            private readonly IMapper _mapper;

            public Handler(WebChatContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<ICollection<GeneralUserProfileModel>> Handle(GetUserProfilesQuery request, CancellationToken cancellationToken)
            {
                var users = _mapper.Map<ICollection<GeneralUserProfileModel>>(await _context.UserProfiles.ToListAsync(cancellationToken));

                return users;
            }
        }
    }
}
