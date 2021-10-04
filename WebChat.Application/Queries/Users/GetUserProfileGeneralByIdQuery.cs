using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Mappings;
using WebChat.Application.Models;
using WebChat.DataAccess.MsSql;

namespace WebChat.Application.Queries
{
    public class GetUserProfileGeneralByIdQuery : IRequest<GeneralProfileModel>
    {
        public int Id { get; set; }

        public GetUserProfileGeneralByIdQuery(int id)
        {
            Id = id;
        }

        public class Handler : IRequestHandler<GetUserProfileGeneralByIdQuery, GeneralProfileModel>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<GeneralProfileModel> Handle(GetUserProfileGeneralByIdQuery request, CancellationToken cancellationToken)
            {
                var entity = await _context.UserProfiles
                    .Include(prop => prop.City)
                    .ThenInclude(prop => prop.Country)
                    .Include(prop => prop.Languages)
                    .ThenInclude(prop => prop.Language)
                    .FirstAsync(userProfile => userProfile.Id == request.Id);

                if (entity is null)
                    throw new NotFoundException(nameof(UserProfile), request.Id);

                var model = new GeneralProfileModel()
                {
                    FirstName = entity.FirstName,
                    LastName = entity.LastName,
                    Birthday = entity.Birthday,
                    Gender = entity.Gender,
                    Country = entity.City?.Country.Name,
                    City = entity.City?.Name,
                    Languages = entity.Languages.Select(prop => prop.Language.Name).ToArray()
                };

                
                return model;
            }
        }
    }
}
