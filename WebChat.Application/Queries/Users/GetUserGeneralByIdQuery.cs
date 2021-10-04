using MediatR;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Queries
{
    public class GetUserGeneralByIdQuery : IRequest<GeneralUserModel>
    {
        public int Id { get; set; }

        public GetUserGeneralByIdQuery(int id)
        {
            Id = id;
        }

        public class Handler : IRequestHandler<GetUserGeneralByIdQuery, GeneralUserModel>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<GeneralUserModel> Handle(GetUserGeneralByIdQuery request, CancellationToken cancellationToken)
            {
                var entity = await _context.Users.FindAsync(request.Id);

                if (entity is null)
                    throw new NotFoundException(nameof(User), request.Id);

                var model = new GeneralUserModel()
                {
                    UserName = entity.UserName,
                    Email = entity.Email,
                    LastUpdatePassword = entity.LastPasswordUpdate
                };


                return model;
            }
        }
    }
}
