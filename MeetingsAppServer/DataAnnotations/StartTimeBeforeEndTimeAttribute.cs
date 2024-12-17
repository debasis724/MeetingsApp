using System;
using System.ComponentModel.DataAnnotations;

namespace Meetings_App_Server.Models.DataAnnotations;

public class StartTimeBeforeEndTimeAttribute : ValidationAttribute
{
    public StartTimeBeforeEndTimeAttribute() : base("Start Time must be before End Time.")
    {
    }

    // Override the IsValid method
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        // Get the object being validated
        var objectInstance = validationContext.ObjectInstance;

        // Retrieve the startTime and endTime properties
        var startTimeProperty = validationContext.ObjectType.GetProperty("StartTime");
        var endTimeProperty = validationContext.ObjectType.GetProperty("EndTime");

        if (startTimeProperty == null || endTimeProperty == null)
        {
            return new ValidationResult("Invalid object structure.");
        }

        var startTime = (DateTime?)startTimeProperty.GetValue(objectInstance);
        var endTime = (DateTime?)endTimeProperty.GetValue(objectInstance);

        // Check if startTime is earlier than endTime
        if (startTime.HasValue && endTime.HasValue && startTime.Value >= endTime.Value)
        {
            // Return an error if startTime is not before endTime
            return new ValidationResult(ErrorMessage);
        }

        // Return ValidationResult.Success if the validation passes
        return ValidationResult.Success;
    }
}
