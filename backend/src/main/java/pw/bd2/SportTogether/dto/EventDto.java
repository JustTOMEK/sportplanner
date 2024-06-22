package pw.bd2.SportTogether.dto;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class EventDto {
    private String title;

    private String description;

    private Integer sportId;

    private String country;

    private String city;

    private String street;

    private String building_number;

    private String flat_number;

    private String postal_code;

    private Double latitude;

    private Double longitude;

    private LocalDateTime start_date;

    private LocalDateTime end_date;
}
