using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace WebChat.Application.Common.Exceptions
{
    public class AuthorizationException : Exception
    {
        public ICollection<string> Errors { get; } = new List<string>();

        public AuthorizationException(string login)
        {
            Errors.Add($"Invalid username or email ({login})");
        }
        public AuthorizationException(SignInResult signInResult)
        {
            if (signInResult.IsLockedOut)
                Errors.Add("The account is locked out");

            if (signInResult.IsNotAllowed)
                Errors.Add("Not allowed to sign-in");

            if (signInResult.RequiresTwoFactor)
                Errors.Add("Requires two factor authorization");
        }
    }
}
