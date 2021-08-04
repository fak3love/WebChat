using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace WebChat.DataAccess.MsSql
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddDataAccessMsSql(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<WebChatContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("WebChatDatabase")));

            return services;
        }
    }
}
