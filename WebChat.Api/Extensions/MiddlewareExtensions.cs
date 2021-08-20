using Microsoft.AspNetCore.Builder;
using WebChat.Api.Middlewares;

namespace WebChat.Api.Extensions
{
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder UseWebChatExceptionHadnler(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionHandlerMiddleware>();
        }
    }
}
