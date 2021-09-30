using System;
using System.Drawing;
using System.IO;

namespace WebChat.Application.Validators
{
    public static class ImageValidator
    {
        public static bool IsValidImage(byte[] bytes)
        {
            try
            {
                _ = Image.FromStream(new MemoryStream(bytes));
            }
            catch (Exception) { return false; }

            return true;
        }
        public static bool IsValidImageByBase64Web(string base64)
        {
            byte[] imageBytes = Convert.FromBase64String(base64.Replace("data:image/png;base64,", ""));

            return IsValidImage(imageBytes);
        }
    }
}
