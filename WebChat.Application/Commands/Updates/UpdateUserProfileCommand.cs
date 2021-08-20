using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Commands.Updates
{
    public class UpdateUserProfileCommand : IRequest
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string StatusMessage { get; set; }
        public DateTime? Birthday { get; set; }
        public int? CityId { get; set; }

        public UpdateUserProfileCommand(int id, string firstName, string lastName, string statusMessage, DateTime? birthday, int? cityId)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            StatusMessage = statusMessage;
            Birthday = birthday;
            CityId = cityId;
        }

        public class Handler : IRequestHandler<UpdateUserProfileCommand, Unit>
        {
            private readonly WebChatContext _context;

            public Handler(WebChatContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(UpdateUserProfileCommand request, CancellationToken cancellationToken)
            {
                var userProfile = await _context.UserProfiles.FindAsync(new object[] { request.Id }, cancellationToken);

                if (userProfile is null)
                    throw new NotFoundException(nameof(UserProfile), request.Id);

                userProfile.FirstName = request.FirstName;
                userProfile.LastName = request.LastName;
                userProfile.StatusMessage = request.StatusMessage;
                userProfile.Birthday = request.Birthday;
                userProfile.CityId = request.CityId;

                await _context.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}
