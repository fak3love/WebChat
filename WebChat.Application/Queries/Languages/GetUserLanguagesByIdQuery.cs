using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Dtos;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Queries
{
    public class GetUserLanguagesByIdQuery : IRequest<ICollection<LanguageDto>>
    {
        public int ProfileId { get; set; }

        public GetUserLanguagesByIdQuery(int profileId)
        {
            ProfileId = profileId;
        }

        public class Handler : IRequestHandler<GetUserLanguagesByIdQuery, ICollection<LanguageDto>>
        {
            private readonly WebChatContext _context;
            private readonly IMapper _mapper;

            public Handler(WebChatContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<ICollection<LanguageDto>> Handle(GetUserLanguagesByIdQuery request, CancellationToken cancellationToken)
            {
                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var result = await _context.UserLanguages
                    .Include(prop => prop.Language)
                    .Where(userLanguage => userLanguage.UserProfileId == request.ProfileId)
                    .Select(prop => prop.Language)
                    .ToListAsync(cancellationToken);

                var dto = _mapper.Map<ICollection<LanguageDto>>(result);

                return dto;
            }
        }
    }
}
