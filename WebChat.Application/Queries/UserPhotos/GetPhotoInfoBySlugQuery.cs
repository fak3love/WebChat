using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Dtos;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Queries
{
    public class GetPhotoInfoBySlugQuery : IRequest<UserPhotoDto>
    {
        public string PhotoSlug { get; set; }

        public GetPhotoInfoBySlugQuery(string photoSlug)
        {
            PhotoSlug = photoSlug;
        }

        public class Handler : IRequestHandler<GetPhotoInfoBySlugQuery, UserPhotoDto>
        {
            private readonly WebChatContext _context;
            private readonly IMapper _mapper;

            public Handler(WebChatContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<UserPhotoDto> Handle(GetPhotoInfoBySlugQuery request, CancellationToken cancellationToken)
            {
                var userPhoto = await _context.UserPhotos.FirstOrDefaultAsync(photo => photo.Slug == request.PhotoSlug);

                if (userPhoto is null)
                    throw new NotFoundException(nameof(UserPhoto), request.PhotoSlug);

                var dto = _mapper.Map<UserPhotoDto>(userPhoto);

                return dto;
            }
        }
    }
}
