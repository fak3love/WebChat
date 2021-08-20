using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Commands.Deletes
{
    public class DeleteLanguageCommand : IRequest<Unit>
    {
        public int ProfileId { get; set; }
        public int LanguageId { get; set; }

        public DeleteLanguageCommand(int profileId, int languageId)
        {
            ProfileId = profileId;
            LanguageId = languageId;
        }

        public class Handler : IRequestHandler<DeleteLanguageCommand, Unit>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(DeleteLanguageCommand request, CancellationToken cancellationToken)
            {
                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.ProfileId }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.ProfileId);

                var userLanguage = await _context.UserLanguages.FirstOrDefaultAsync(userLanguage => userLanguage.UserProfileId == request.ProfileId && userLanguage.LanguageId == request.LanguageId, cancellationToken);

                if (userLanguage is null)
                    throw new NotFoundException(nameof(UserLanguage), string.Format("ProfileId: {0}, LanguageId: {1}", request.ProfileId, request.LanguageId));

                _context.UserLanguages.Remove(userLanguage);
                await _context.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}
