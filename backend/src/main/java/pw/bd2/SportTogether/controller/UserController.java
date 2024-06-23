package pw.bd2.SportTogether.controller;

import lombok.RequiredArgsConstructor;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import pw.bd2.SportTogether.service.JwtService;
import pw.bd2.SportTogether.service.UserService;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/upload-profile-picture")
    public ResponseEntity<?> uploadProfilePicture(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt, @RequestParam("file") MultipartFile file) {
        try {
            byte[] profilePicture = file.getBytes();
            userService.setProfilePicture(jwtService.extractUsername(jwt), profilePicture);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error reading file");
        }
    }

    @GetMapping("/get-profile-picture")
    public ResponseEntity<byte[]> getProfilePicture(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt) {
        try {
            byte[] profilePicture = userService.getProfilePicture(jwtService.extractUsername(jwt));
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.IMAGE_JPEG);
            return new ResponseEntity<>(profilePicture, headers, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
