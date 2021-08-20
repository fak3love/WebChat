using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Queries
{
    public class GetPhotoSlugsByProfileIdQuery : IRequest<ICollection<string>>
    {
        public int ProfileId { get; set; }
        public bool OnlyAvatars { get; set; }

        public GetPhotoSlugsByProfileIdQuery(int profileId)
        {
            ProfileId = profileId;
        }

        public class Handler : IRequestHandler<GetPhotoSlugsByProfileIdQuery, ICollection<string>>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<ICollection<string>> Handle(GetPhotoSlugsByProfileIdQuery request, CancellationToken cancellationToken)
            {
                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var slugs = await _context.UserPhotos.Where(photo => photo.UserProfileId == request.ProfileId && (!request.OnlyAvatars || photo.IsAvatar)).Select(prop => prop.Slug).ToListAsync(cancellationToken);

                return slugs;
            }
        }
    }
}
