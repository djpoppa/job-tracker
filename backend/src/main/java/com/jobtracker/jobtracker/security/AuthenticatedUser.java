package com.jobtracker.jobtracker.security;

/**
 * The authenticated identity available to protected request handlers.
 */
public record AuthenticatedUser(Long id, String email) {
}
