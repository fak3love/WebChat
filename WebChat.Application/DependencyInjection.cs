using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using WebChat.Application.Common.Behaviours;
using WebChat.Application.Services;
using WebChat.Domain.Interfaces.Services;

namespace WebChat.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            services.AddMediatR(Assembly.GetExecutingAssembly());
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestValidationBehavior<,>));

            services.AddScoped<IJwtGenerator, JwtGenerator>(conf => new JwtGenerator(conf.GetRequiredService<IConfiguration>()));

            return services;
        }
    }
}
