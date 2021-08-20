using WebChat.Domain.Entities;

namespace WebChat.Domain.Interfaces.Services
{
    public interface IJwtGenerator
    {
        string CreateToken(User user);
    }
}
