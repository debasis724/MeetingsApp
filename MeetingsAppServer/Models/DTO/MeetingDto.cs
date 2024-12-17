namespace Meetings_App_Server.Models.DTO;

using Meetings_App_Server.Models.Domains;
using System.Collections.Generic;

public class MeetingDto
{
    public int Id { get; set; }  // Primary Key
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public ICollection<AttendeeDto> Attendees { get; set; }
}

