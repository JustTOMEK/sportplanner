package pw.bd2.SportTogether.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pw.bd2.SportTogether.service.JwtService;
import pw.bd2.SportTogether.model.Participation;
import pw.bd2.SportTogether.service.ParticipationService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/participations")
public class ParticipationController {
    @Autowired
    private ParticipationService participationService;

    @GetMapping
    public ResponseEntity<List<Participation>> getAllParticipations() {
        List<Participation> participations = participationService.getAllParticipations();
        return new ResponseEntity<>(participations, HttpStatus.OK);
    }
}
