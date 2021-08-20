using System;

namespace WebChat.Application.Common.Exceptions
{
    public class BadRequestException : Exception
    {
        public BadRequestException() : base("Bad request")
        {
        }
    }
}
