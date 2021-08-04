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
            response.ContentType = "application/text";

            switch (exception)
            {
                case ValidationException:
                    response.ContentType = "application/json";
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    result = JsonConvert.SerializeObject((exception as ValidationException).Failures);

                    break;
                case NotFoundException:
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
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
