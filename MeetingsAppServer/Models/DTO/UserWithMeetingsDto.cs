using Meetings_App_Server.Models.Domains;
using System.Collections.Generic;
namespace Meetings_App_Server.Models.DTO;

public class UserWithMeetingsDto
{
    public string UserId { get; set; }
    public string Email { get; set; }
    public List<AttendeesMeeting> Meetings { get; set; }/// List of Meeting IDs the user is part of

}
public class AttendeesMeeting
{
    public int MeetingId { get; set; }
}
