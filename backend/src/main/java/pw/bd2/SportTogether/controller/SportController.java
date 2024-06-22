package pw.bd2.SportTogether.controller;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import pw.bd2.SportTogether.model.User;
import pw.bd2.SportTogether.service.JwtService;
import pw.bd2.SportTogether.model.Sport;
import pw.bd2.SportTogether.service.SportService;
import org.springframework.beans.factory.annotation.Autowired;
import pw.bd2.SportTogether.service.UserService;

import java.io.IOException;
import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sports")
public class SportController {
    @Autowired
    private SportService sportService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public ResponseEntity<List<Sport>> getAllSports() {
        List<Sport> sports = sportService.getAllSports();
        return new ResponseEntity<>(sports, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<Sport> createSport(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt, @RequestBody String sportName) {
        try {
            Sport sport =  sportService.createSport(sportName, jwtService.extractUsername(jwt));
            return ResponseEntity.status(HttpStatus.CREATED).body(sport);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @DeleteMapping("/delete")
    public void deleteSport(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt, @RequestBody Integer sportId, HttpServletResponse response) throws IOException {
        try {
            sportService.deleteSport(sportId, jwtService.extractUsername(jwt));
        } catch (UsernameNotFoundException e) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        } catch (AccessDeniedException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}
