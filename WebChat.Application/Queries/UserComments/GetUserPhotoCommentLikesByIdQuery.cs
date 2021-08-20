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
    public class GetUserPhotoCommentLikesByIdQuery : IRequest<ICollection<GeneralUserProfileModel>>
    {
        public int CommentId { get; set; }

        public GetUserPhotoCommentLikesByIdQuery(int commentId)
        {
            CommentId = commentId;
        }

        public class Handler : IRequestHandler<GetUserPhotoCommentLikesByIdQuery, ICollection<GeneralUserProfileModel>>
        {
            private readonly WebChatContext _context;
            private readonly IMapper _mapper;

            public Handler(WebChatContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<ICollection<GeneralUserProfileModel>> Handle(GetUserPhotoCommentLikesByIdQuery request, CancellationToken cancellationToken)
            {
                var comment = await _context.UserPhotoComments
                    .Include(prop => prop.Likes)
                    .ThenInclude(prop => prop.UserProfile)
                    .FirstOrDefaultAsync(userPhotoComment => userPhotoComment.Id == request.CommentId);

                if (comment is null)
                    throw new NotFoundException(nameof(UserPhotoComment), request.CommentId);

                var dto = _mapper.Map<ICollection<GeneralUserProfileModel>>(comment.Likes.Select(prop => prop.UserProfile));

                return dto;
            }
        }
    }
}
