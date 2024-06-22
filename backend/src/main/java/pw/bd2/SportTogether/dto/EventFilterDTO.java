package pw.bd2.SportTogether.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class EventFilterDTO {
    private String title;

    private String country;

    private String city;

    private List<Integer> sportIds;
}
