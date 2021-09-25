using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.DataAccess.MsSql;

namespace WebChat.Application.Queries
{
    public class GetAvatarSlugByProfileIdQuery : IRequest<string>
    {
        public int ProfileId { get; set; }

        public GetAvatarSlugByProfileIdQuery(int profileId)
        {
            ProfileId = profileId;
        }

        public class Handler : IRequestHandler<GetAvatarSlugByProfileIdQuery, string>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<string> Handle(GetAvatarSlugByProfileIdQuery request, CancellationToken cancellationToken)
            {
                var result = await _context.UserPhotos
                    .OrderByDescending(prop => prop.CreatedAt)
                    .FirstOrDefaultAsync(photo => photo.UserProfileId == request.ProfileId && photo.IsAvatar);

                return result?.Slug;
            }
        }
    }
}
