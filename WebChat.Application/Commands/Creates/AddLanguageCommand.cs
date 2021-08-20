using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Commands
{
    public class AddLanguageCommand : IRequest<Unit>
    {
        public int ProfileId { get; set; }
        public int LanguageId { get; set; }

        public AddLanguageCommand(int profileId, int languageId)
        {
            ProfileId = profileId;
            LanguageId = languageId;
        }

        public class Handler : IRequestHandler<AddLanguageCommand, Unit>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(AddLanguageCommand request, CancellationToken cancellationToken)
            {
                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var language = await _context.Languages.FindAsync(new object[] { request.LanguageId }, cancellationToken);

                if (language is null)
                    throw new NotFoundException(nameof(Language), request.LanguageId);

                var userLanguage = await _context.UserLanguages.FirstOrDefaultAsync(userLanguage => userLanguage.UserProfileId == request.ProfileId && userLanguage.LanguageId == request.LanguageId, cancellationToken);

                if (userLanguage is not null)
                    throw new BadRequestException();

                var entity = (await _context.UserLanguages.AddAsync(new UserLanguage() { UserProfileId = request.ProfileId, LanguageId = request.LanguageId }, cancellationToken)).Entity;

                await _context.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}
