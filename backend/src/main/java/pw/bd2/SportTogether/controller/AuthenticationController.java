package pw.bd2.SportTogether.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pw.bd2.SportTogether.dto.AuthenticationRequest;
import pw.bd2.SportTogether.dto.AuthenticationResponse;
import pw.bd2.SportTogether.dto.RegisterRequest;
import pw.bd2.SportTogether.service.AuthenticationService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ){
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ){
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @DeleteMapping("/logout")
    public void logout(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt){
        authenticationService.logout(jwt);
    }
}
