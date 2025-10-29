package albcars.project.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

@ControllerAdvice
public class GlobalUploadExceptionHandler {

    private ResponseEntity<Object> json(HttpStatus status, String message, HttpServletRequest req) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", OffsetDateTime.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("path", req.getRequestURI());
        return ResponseEntity.status(status).body(body);
    }

    private ResponseEntity<Object> conflict(String code, String message, HttpServletRequest req) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", OffsetDateTime.now().toString());
        body.put("status", HttpStatus.CONFLICT.value());
        body.put("error", HttpStatus.CONFLICT.getReasonPhrase());
        body.put("code", code);
        body.put("message", message);
        body.put("path", req.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    // ---- Upload size handlers ----

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Object> handleMaxSize(MaxUploadSizeExceededException ex, HttpServletRequest req) {
        String msg = "Upload too large. Per file limit is 5 MB, total request limit is 100 MB.";
        return json(HttpStatus.PAYLOAD_TOO_LARGE, msg, req);
    }

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<Object> handleMultipart(MultipartException ex, HttpServletRequest req) {
        String em = Objects.toString(ex.getMessage(), "");
        boolean sizeRelated = em.toLowerCase().contains("size");
        String message = sizeRelated
                ? "Upload too large. Per file limit is 5 MB, total request limit is 100 MB."
                : "Invalid upload. Please try again.";
        HttpStatus status = sizeRelated ? HttpStatus.PAYLOAD_TOO_LARGE : HttpStatus.BAD_REQUEST;
        return json(status, message, req);
    }

    // ---- Unique constraint violations → 409 Conflict ----

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest req) {
        String constraintName = null;
        Throwable cause = ex.getCause();
        if (cause instanceof ConstraintViolationException cve) {
            constraintName = cve.getConstraintName();
        }

        String constraint = Objects.toString(constraintName, "").toLowerCase();
        String rootMsg = Objects.toString(ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : "", "")
                .toLowerCase();

        // Match actual DB constraint names (from SHOW CREATE TABLE)
        if (constraint.equals("email") || rootMsg.contains("email")) {
            return conflict("EMAIL_ALREADY_IN_USE", "Email already registered", req);
        }

        if (constraint.equals("phone_number") || rootMsg.contains("phone")) {
            return conflict("PHONE_ALREADY_IN_USE", "Phone number already registered", req);
        }

        // fallback
        return conflict("DUPLICATE_RESOURCE", "Resource already exists", req);
    }
}
