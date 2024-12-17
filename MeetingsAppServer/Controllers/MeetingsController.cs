using Meetings_App_Server.Data;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Meetings_App_Server.Models;
using Microsoft.EntityFrameworkCore;

using Meetings_App_Server.Models.DTO;
using Meetings_App_Server.Models.Domains;

namespace Meetings_App_Server.Controllers;



[Route("api/[controller]")]

[ApiController]

public class MeetingsController : ControllerBase

{



    private readonly ApplicationDbContext _context;

    public MeetingsController(ApplicationDbContext context)

    {

        _context = context;

    }

    // GET: api/Meetings

    [HttpGet]

    public async Task<ActionResult<IEnumerable<Meeting>>> GetMeetings()

    {

        return await _context.Meetings.ToListAsync();

        //.Include(m => m.Attendees)

        //.ThenInclude(a => a.User)

        //.ToListAsync();


        // POST: api/Meetings

        // Controllers/MeetingsController.cs

    }


    [HttpPost]

    public async Task<ActionResult<Meeting>> PostMeeting(AddMeetingRequestDto addMeetingRequest)

    {

        // Validate the incoming data

        if (!ModelState.IsValid)

        {

            return BadRequest(ModelState);  // Returns 400 if the data is not valid

        }

        // Create the Meeting model based on the received DTO data

        var meeting = new Meeting

        {

            Name = addMeetingRequest.Name,

            Description = addMeetingRequest.Description,

            Date = addMeetingRequest.Date,

            StartTime = addMeetingRequest.StartTime,

            EndTime = addMeetingRequest.EndTime

        };

        // Add the meeting to the database

        _context.Meetings.Add(meeting);

        await _context.SaveChangesAsync();

        // Return a 201 Created status with the newly created meeting

        return CreatedAtAction(nameof(GetMeetings), new { id = meeting.Id }, meeting);

    }



}