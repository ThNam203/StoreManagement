package com.springboot.store.config;

import com.springboot.store.repository.TokenRepository;
import com.springboot.store.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {

    private final TokenRepository tokenRepository;
    private final JwtService jwtService;

    @Override
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
//        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
//            return;
//        }
//        jwt = authHeader.substring(7);

        jwt = jwtService.getJwtRefreshFromCookie(request);
        if (jwt == null || jwt.isEmpty()) {
            return;
        }

        // remove access token and refresh token from cookie
        response.addHeader("Set-Cookie", "access-token=; Path=/; HttpOnly; Max-Age=0");
        response.addHeader("Set-Cookie", "refresh-token=; Path=/; HttpOnly; Max-Age=0");

        var storedToken = tokenRepository.findByToken(jwt)
                .orElse(null);
        if (storedToken != null) {
            storedToken.setExpired(true);
            storedToken.setRevoked(true);
            tokenRepository.save(storedToken);
            SecurityContextHolder.clearContext();
        }
    }
}