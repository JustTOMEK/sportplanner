package pw.bd2.SportTogether.controller;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pw.bd2.SportTogether.model.User;
import pw.bd2.SportTogether.service.JwtService;
import pw.bd2.SportTogether.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt) {
        try {
            String username = jwtService.extractUsername(jwt);
            User user = userService.findByUsername(username);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
