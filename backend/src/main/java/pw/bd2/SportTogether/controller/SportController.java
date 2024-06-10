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
import pw.bd2.SportTogether.model.Sport;
import pw.bd2.SportTogether.service.SportService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sports")
public class SportController {
    @Autowired
    private SportService sportService;

    @GetMapping
    public ResponseEntity<List<Sport>> getAllSports() {
        List<Sport> sports = sportService.getAllSports();
        return new ResponseEntity<>(sports, HttpStatus.OK);
    }
}
