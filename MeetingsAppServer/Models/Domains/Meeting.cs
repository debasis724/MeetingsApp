using Meetings_App_Server.Models.DataAnnotations;
using Meetings_App_Server.CustomConverter;
using Meetings_App_Server.Models.Domains;
namespace Meetings_App_Server.Models.Domains
{
    public class Meeting
    {

        public int Id { get; set; }  // Primary Key
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public TimeOnly StartTime { get; set; }
        [StartTimeBeforeEndTime]
        public TimeOnly EndTime { get; set; }
        public ICollection<Attendee> Attendees { get; set; }

    }


}