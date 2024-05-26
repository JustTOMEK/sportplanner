package pw.bd2.SportTogether.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import pw.bd2.SportTogether.model.Role;
import pw.bd2.SportTogether.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pw.bd2.SportTogether.dto.AuthenticationRequest;
import pw.bd2.SportTogether.dto.AuthenticationResponse;
import pw.bd2.SportTogether.dto.RegisterRequest;
import pw.bd2.SportTogether.repository.UserRepository;

@Service
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
         var user = User.builder()
                 .username(request.getUsername())
                 .password(passwordEncoder.encode(request.getPassword()))
                 .role(Role.USER)
                 .build();
         userRepository.save(user);
         var jwt = jwtService.generateToken(user);
         return AuthenticationResponse.builder()
                 .token(jwt)
                 .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword()
                )
        );
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        var jwt = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwt)
                .build();
    }
}
