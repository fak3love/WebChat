using FluentValidation;
using System;
using System.Drawing;
using System.IO;
using WebChat.Application.Commands.Creates;

namespace WebChat.Application.Validators
{
    public class UploadPhotoCommandValidator : AbstractValidator<UploadPhotoCommand>
    {
        public UploadPhotoCommandValidator()
        {
            RuleFor(prop => prop.ProfileId).GreaterThan(0).WithMessage("Must be greater than 0");
            RuleFor(prop => prop.ImageBaseString).NotEmpty().WithMessage("The field cannot be empty").Must(BeAValidBase64String).WithMessage("Invalid Base64String");
        }

        private bool BeAValidBase64String(string baseString)
        {
            byte[] imageBytes = Convert.FromBase64String(baseString);

            try
            {
                using var imageStream = new MemoryStream(imageBytes);
                Image.FromStream(imageStream);
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }
    }
}
