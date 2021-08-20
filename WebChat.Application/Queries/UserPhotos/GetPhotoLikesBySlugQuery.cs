using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Queries
{
    public class GetPhotoLikesBySlugQuery : IRequest<ICollection<GeneralUserProfileModel>>
    {
        public string PhotoSlug { get; set; }

        public GetPhotoLikesBySlugQuery(string photoSlug)
        {
            PhotoSlug = photoSlug;
        }

        public class Handler : IRequestHandler<GetPhotoLikesBySlugQuery, ICollection<GeneralUserProfileModel>>
        {
            private readonly WebChatContext _context;
            private readonly IMapper _mapper;

            public Handler(WebChatContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<ICollection<GeneralUserProfileModel>> Handle(GetPhotoLikesBySlugQuery request, CancellationToken cancellationToken)
            {
                var userPhoto = await _context.UserPhotos.FirstOrDefaultAsync(userPhoto => userPhoto.Slug == request.PhotoSlug);

                if (userPhoto is null)
                    throw new NotFoundException(nameof(UserPhoto), request.PhotoSlug);

                var userProfiles = _context.UserPhotoLikes.Include(prop => prop.UserProfile).Where(userPhotoLike => userPhotoLike.UserPhotoId == userPhoto.Id).Select(prop => prop.UserProfile);

                var dto = _mapper.Map<ICollection<GeneralUserProfileModel>>(userProfiles);

                return dto;
            }
        }
    }
}
