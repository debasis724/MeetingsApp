using Meetings_App_Server.CustomConverter;

namespace Meetings_App_Server.Models.DTO

{

    public class AddMeetingRequestDto

    {

        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime Date { get; set; }  // Use DateTime for the meeting date

        public TimeOnly StartTime { get; set; }  // TimeOnly for start time

        public TimeOnly EndTime { get; set; }  // TimeOnly for end time

    }
}