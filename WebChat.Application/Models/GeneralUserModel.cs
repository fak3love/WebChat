using System;

namespace WebChat.Application.Models
{
    public class GeneralUserModel
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public DateTime LastUpdatePassword { get; set; }
    }
}
