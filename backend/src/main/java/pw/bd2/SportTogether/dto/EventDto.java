package pw.bd2.SportTogether.dto;

import lombok.Getter;

@Getter
public class EventDto {
    private String title;

    private String description;

    private Integer sportId;

    private String country;

    private String city;

    private String street;

    private Integer building_number;

    private Integer flat_number;

    private String postal_code;

    private Double latitude;

    private Double longitude;
}
