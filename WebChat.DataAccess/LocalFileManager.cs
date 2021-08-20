using System;
using System.IO;
using System.Threading.Tasks;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.DataAccess
{
    public class LocalFileManager : IFileManager
    {
        public string RootPath { get; }

        public LocalFileManager(string rootPath)
        {
            RootPath = rootPath;
        }

        public async Task<byte[]> ReadAllBytes(string fileName)
        {
            try
            {
                return await File.ReadAllBytesAsync(Combine(fileName));
            }
            catch (Exception) { throw new Exception("Bad request"); }
        }
        public async Task<bool> WriteAllBytes(string fileName, byte[] bytes)
        {
            try
            {
                await File.WriteAllBytesAsync(Combine(fileName), bytes);
                return true;
            }
            catch (Exception) { throw new Exception("Bad request"); }
        }

        public async Task<bool> Delete(string fileName)
        {
            try
            {
                return await Task.Run(() =>
                {
                    File.Delete(Combine(fileName));
                    return true;
                });
            }
            catch (Exception) { throw new Exception("Bad request"); }
        }

        private string Combine(string path) => Path.Combine(RootPath, path);
    }
}
