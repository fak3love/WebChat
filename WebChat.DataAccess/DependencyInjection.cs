using Microsoft.Extensions.DependencyInjection;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.DataAccess
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddDataAccess(this IServiceCollection services, string localStoragePath)
        {
            services.AddScoped<IFileManager, LocalFileManager>(conf => new LocalFileManager(localStoragePath));

            return services;
        }
    }
}
