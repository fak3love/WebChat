using MediatR;
using Microsoft.AspNetCore.JsonPatch;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.Application.Validators;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Commands.Updates
{
    public class PatchUserProfileCommand : IRequest
    {
        public int Id { get; set; }
        public JsonPatchDocument<UserProfile> JsonPatch { get; set; }

        public PatchUserProfileCommand(int id, JsonPatchDocument<UserProfile> jsonPatch)
        {
            Id = id;
            JsonPatch = jsonPatch;
        }

        public class Handler : IRequestHandler<PatchUserProfileCommand, Unit>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(PatchUserProfileCommand request, CancellationToken cancellationToken)
            {
                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.Id }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.Id);

                var validator = new UserProfileValidator();

                request.JsonPatch.ApplyTo(userProfile);

                var validationResult = await validator.ValidateAsync(userProfile, cancellationToken);

                if (!validationResult.IsValid)
                    throw new ValidationException(validationResult.Errors);

                await _context.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}
