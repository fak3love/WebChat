using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Dtos;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Queries
{
    public class GetPhotoInfoBySlugQuery : IRequest<PhotoInfoModel>
    {
        public int ProfileId { get; set; }
        public string PhotoSlug { get; set; }

        public GetPhotoInfoBySlugQuery(int profileId, string photoSlug)
        {
            ProfileId = profileId;
            PhotoSlug = photoSlug;
        }

        public class Handler : IRequestHandler<GetPhotoInfoBySlugQuery, PhotoInfoModel>
        {
            private readonly WebChatContext _context;
            private readonly IMapper _mapper;

            public Handler(WebChatContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<PhotoInfoModel> Handle(GetPhotoInfoBySlugQuery request, CancellationToken cancellationToken)
            {
                var userPhoto = await _context.UserPhotos.FirstOrDefaultAsync(photo => photo.Slug == request.PhotoSlug);

                if (userPhoto is null)
                    throw new NotFoundException(nameof(UserPhoto), request.PhotoSlug);

                var likesProfileId = await _context.UserPhotoLikes.Where(prop => prop.UserPhotoId == userPhoto.Id).Select(prop => prop.UserProfileId).ToListAsync();

                var photoInfoModel = new PhotoInfoModel()
                {
                    CreatedDate = userPhoto.CreatedAt,
                    Likes = likesProfileId.Count,
                    Liked = likesProfileId.Contains(request.ProfileId),
                    Editable = userPhoto.UserProfileId == request.ProfileId
                };

                return photoInfoModel;
            }
        }
    }
}
