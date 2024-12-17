using Meetings_App_Server.Models.Domains;
using Microsoft.AspNetCore.Identity;
namespace Meetings_App_Server.Models.Domains;
public class Attendee
{
    public int MeetingId { get; set; }  // Foreign key to Meeting
    public Meeting Meeting { get; set; } // Navigation property to Meeting

    public string UserId { get; set; }  // Foreign key to ApplicationUser
    public IdentityUser User { get; set; } // Navigation property to User
}