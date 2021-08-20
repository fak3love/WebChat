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
    public class GetUserPhotoCommentsByPhotoSlugQuery : IRequest<ICollection<UserPhotoCommentDto>>
    {
        public string PhotoSlug { get; set; }

        public GetUserPhotoCommentsByPhotoSlugQuery(string photoSlug)
        {
            PhotoSlug = photoSlug;
        }

        public class Handler : IRequestHandler<GetUserPhotoCommentsByPhotoSlugQuery, ICollection<UserPhotoCommentDto>>
        {
            private readonly WebChatContext _context;
            private readonly IMapper _mapper;

            public Handler(WebChatContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<ICollection<UserPhotoCommentDto>> Handle(GetUserPhotoCommentsByPhotoSlugQuery request, CancellationToken cancellationToken)
            {
                var userPhoto = await _context.UserPhotos
                    .Include(prop => prop.Comments)
                    .FirstOrDefaultAsync(userPhoto => userPhoto.Slug == request.PhotoSlug);

                if (userPhoto is null)
                    throw new NotFoundException(nameof(UserPhoto), request.PhotoSlug);

                var dto = _mapper.Map<ICollection<UserPhotoCommentDto>>(userPhoto.Comments);

                return dto;
            }
        }
    }
}
