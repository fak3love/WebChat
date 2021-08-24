using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Threading;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;
using WebChat.DataAccess.MsSql;
using WebChat.Domain.Entities;

namespace WebChat.Application.Commands.Deletes
{
    public class DeleteAccountCommand : IRequest
    {
        public int Id { get; set; }

        public DeleteAccountCommand(int id)
        {
            Id = id;
        }

        public class Handler : IRequestHandler<DeleteAccountCommand, Unit>
        {
            private readonly WebChatContext _context;
            private readonly UserManager<User> _userManager;

            public Handler(WebChatContext context, UserManager<User> userManager)
            {
                _context = context;
                _userManager = userManager;
            }

            public async Task<Unit> Handle(DeleteAccountCommand request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByIdAsync(request.Id.ToString());

                if (user is null)
                    throw new NotFoundException(nameof(User), request.Id);

                await _userManager.DeleteAsync(user);

                return Unit.Value;
            }
        }
    }
}
