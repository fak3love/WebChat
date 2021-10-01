using MediatR;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Queries
{
    public class GetUserProfileNameByIdQuery : IRequest<ProfileNameModel>
    {
        public int ProfileId { get; set; }

        public GetUserProfileNameByIdQuery(int profileId)
        {
            ProfileId = profileId;
        }

        public class Handler : IRequestHandler<GetUserProfileNameByIdQuery, ProfileNameModel>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<ProfileNameModel> Handle(GetUserProfileNameByIdQuery request, CancellationToken cancellationToken)
            {
                var entity = await _context.UserProfiles.FindAsync(request.ProfileId);

                if (entity is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var profileName = new ProfileNameModel()
                {
                    FirstName = entity.FirstName,
                    LastName = entity.LastName
                };

                return profileName;
            }
        }
    }
}
