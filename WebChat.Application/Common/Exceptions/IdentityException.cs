using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;

namespace WebChat.Application.Common.Exceptions
{
    public class IdentityException : Exception
    {
        public IEnumerable<string> Errors { get; }

        public IdentityException(IEnumerable<IdentityError> errors) : base("One or more identity errors have occurred")
        {
            Errors = errors.Select(error => error.Description);
        }
    }
}
