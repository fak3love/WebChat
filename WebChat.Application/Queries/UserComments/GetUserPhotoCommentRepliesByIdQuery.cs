using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Dtos;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Queries
{
    public class GetUserPhotoCommentRepliesByIdQuery : IRequest<ICollection<UserPhotoCommentDto>>
    {
        public int CommentId { get; set; }

        public GetUserPhotoCommentRepliesByIdQuery(int commentId)
        {
            CommentId = commentId;
        }

        public class Handler : IRequestHandler<GetUserPhotoCommentRepliesByIdQuery, ICollection<UserPhotoCommentDto>>
        {
            private readonly WebChatContext _context;
            private readonly IMapper _mapper;

            public Handler(WebChatContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<ICollection<UserPhotoCommentDto>> Handle(GetUserPhotoCommentRepliesByIdQuery request, CancellationToken cancellationToken)
            {
                var userPhotoComment = await _context.UserPhotoComments
                    .Include(prop => prop.RepliesToComment)
                    .FirstOrDefaultAsync(userPhotoComment => userPhotoComment.Id == request.CommentId);

                if (userPhotoComment is null)
                    throw new NotFoundException(nameof(UserPhotoComment), request.CommentId);

                var dto = _mapper.Map<ICollection<UserPhotoCommentDto>>(userPhotoComment.RepliesToComment);

                return dto;
            }
        }
    }
}
