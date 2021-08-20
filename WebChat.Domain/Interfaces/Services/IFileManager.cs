using System.Threading.Tasks;

namespace WebChat.Domain.Interfaces.Services
{
    public interface IFileManager
    {
        public Task<bool> WriteAllBytes(string fileName, byte[] bytes);
        public Task<bool> Delete(string fileName);
        public Task<byte[]> ReadAllBytes(string fileName);
    }
}
