namespace Meetings_App_Server.Models.DTO
{
    public class AddAttendeeRequest
    {
        public int MeetingId { get; set; }
        //public string UserId { get;  set; }
        public string Email { get; set; }
    }
}
