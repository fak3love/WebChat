using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Threading.Tasks;
using WebChat.Application.Common.Exceptions;

namespace WebChat.Api.Middlewares
{
    public class ExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlerMiddleware> _logger;

        public ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                await HandleExceptionAsync(context, exception);

                _logger.LogError(exception.Message);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            string result = string.Empty;
            var response = context.Response;
            response.StatusCode = (int)HttpStatusCode.BadRequest;
            response.ContentType = "application/text";

            switch (exception)
            {
                case ValidationException:
                    response.ContentType = "application/json";

                    if ((exception as ValidationException).Errors.Count > 0)
                        result = JsonConvert.SerializeObject((exception as ValidationException).Errors);

                    break;
                case IdentityException:
                    response.ContentType = "application/json";
                    result = JsonConvert.SerializeObject((exception as IdentityException).Errors);

                    break;
                case AuthorizationException:
                    response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    response.ContentType = "application/json";
                    result = JsonConvert.SerializeObject((exception as AuthorizationException).Errors);

                    break;
                case NotFoundException:
                    result = exception.Message;

                    break;
                case BadRequestException:
                    result = exception.Message;

                    break;
                default:
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break;
            }

            if (result == string.Empty)
                result = JsonConvert.SerializeObject(new { Error = exception.Message });

            await response.WriteAsync(result);
        }
    }
}
