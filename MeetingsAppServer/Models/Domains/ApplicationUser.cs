using Meetings_App_Server.Models.Domains;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity;

namespace Meetings_App_Server.Models.Domains
{
    public class ApplicationUser : IdentityUser
    {
        // Additional properties for the user can go here
        //public string FullName { get; set; }
        //public List<Meeting> OrganizedMeetings { get; set; }  // Meetings organized by the user
        //public List<Attendee> AttendedMeetings { get; set; }  // Meetings the user is attending

        public string UserName { get; set; }
        public ICollection<Attendee> Meetings { get; set; }
    }
}