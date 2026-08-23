package com.jobtracker.jobtracker.security;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.csrf.CsrfTokenRequestHandler;
import org.springframework.security.web.csrf.XorCsrfTokenRequestAttributeHandler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.function.Supplier;

public final class SpaCsrfTokenRequestHandler
        implements CsrfTokenRequestHandler {

    private final CsrfTokenRequestHandler plain =
            new CsrfTokenRequestAttributeHandler();

    private final CsrfTokenRequestHandler xor =
            new XorCsrfTokenRequestAttributeHandler();

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            Supplier<CsrfToken> deferredCsrfToken) {

        /*
         * Force the deferred token to be loaded so that the
         * XSRF-TOKEN cookie is created/refreshed for the SPA.
         */
        CsrfToken token = deferredCsrfToken.get();

        /*
         * Make the token available through all of the standard
         * request attributes used by Spring Security / Spring MVC.
         */
        request.setAttribute(CsrfToken.class.getName(), token);
        request.setAttribute(token.getParameterName(), token);
        request.setAttribute(token.getHeaderName(), token);
    }

    @Override
    public String resolveCsrfTokenValue(
            HttpServletRequest request,
            CsrfToken csrfToken) {

        String headerValue =
                request.getHeader(csrfToken.getHeaderName());

        /*
         * React sends the raw token in the X-XSRF-TOKEN header,
         * so use the plain resolver for that header.
         */
        if (headerValue != null && !headerValue.isBlank()) {
            return plain.resolveCsrfTokenValue(request, csrfToken);
        }

        /*
         * Preserve Spring Security's XOR handling for other
         * request mechanisms.
         */
        return xor.resolveCsrfTokenValue(request, csrfToken);
    }
}