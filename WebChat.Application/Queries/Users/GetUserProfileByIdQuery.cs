using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Queries
{
    public class GetUserProfileByIdQuery : IRequest<GeneralUserProfileModel>
    {
        public int Id { get; set; }

        public GetUserProfileByIdQuery(int id)
        {
            Id = id;
        }

        public class Handler : IRequestHandler<GetUserProfileByIdQuery, GeneralUserProfileModel>
        {
            private readonly WebChatContext _context;
            private readonly IMapper _mapper;

            public Handler(WebChatContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<GeneralUserProfileModel> Handle(GetUserProfileByIdQuery request, CancellationToken cancellationToken)
            {
                var entity = await _context.UserProfiles.FindAsync(new object[] { request.Id }, cancellationToken);

                if (entity is null)
                    throw new NotFoundException(nameof(UserProfile), request.Id);

                var dto = _mapper.Map<GeneralUserProfileModel>(entity);

                return dto;
            }
        }
    }
}
