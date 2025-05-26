namespace E_commerce_backend.Models
{
    public class ExceptionDetails // Renamed for clarity, or use ProblemDetails
    {
        public string Message { get; set; }
        public int StatusCode { get; set; }
        public DateTime Timestamp { get; set; }
        public string? StackTrace { get; set; } // Optional for development

        public ExceptionDetails(string message, int statusCode, DateTime timestamp, string? stackTrace = null)
        {
            Message = message;
            StatusCode = statusCode;
            Timestamp = timestamp;
            StackTrace = stackTrace;
        }
    }
}