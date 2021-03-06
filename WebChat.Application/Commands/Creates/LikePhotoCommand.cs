using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Commands.Creates
{
    public class LikePhotoCommand : IRequest
    {
        public int ProfileId { get; set; }
        public string PhotoSlug { get; set; }

        public LikePhotoCommand(int profileId, string photoSlug)
        {
            ProfileId = profileId;
            PhotoSlug = photoSlug;
        }

        public class Handler : IRequestHandler<LikePhotoCommand, Unit>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(LikePhotoCommand request, CancellationToken cancellationToken)
            {
                var profile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (profile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var userPhoto = await _context.UserPhotos.FirstOrDefaultAsync(userPhoto => userPhoto.Slug == request.PhotoSlug, cancellationToken);

                if (userPhoto is null)
                    throw new NotFoundException(nameof(UserPhoto), request.PhotoSlug);

                var userPhotoLike = _context.UserPhotoLikes.FirstOrDefault(userPhotoLike => userPhotoLike.UserProfileId == request.ProfileId && userPhotoLike.UserPhotoId == userPhoto.Id);

                if (userPhotoLike is not null)
                    throw new BadRequestException();

                userPhotoLike = new UserPhotoLike()
                {
                    UserProfileId = request.ProfileId,
                    UserPhotoId = userPhoto.Id
                };

                await _context.UserPhotoLikes.AddAsync(userPhotoLike, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}
