using System;
using System.Collections.Generic;
using WebChat.Application.Dtos;

namespace WebChat.Application.Models
{
    public class GeneralUserProfileModel
    {
        public int Id { get; set; }
        public string City { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string StatusMessage { get; set; }
        public string Gender { get; set; }
        public string Avatar { get; set; }
        public string AvatarSlug { get; set; }
        public int FriendCount { get; set; }
        public int FollowerCount { get; set; }
        public int SubscriptionCount { get; set; }
        public int PhotoCount { get; set; }
        public FriendDto FriendStatus { get; set; }
        public DateTime LastActionDate { get; set; }
        public DateTime? Birthday { get; set; }
        public ICollection<string> Languages { get; set; }
    }
}
