package pw.bd2.SportTogether.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "event")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    private String description;

    @ManyToOne
    @PrimaryKeyJoinColumn
    private User owner;

    @ManyToOne
    @PrimaryKeyJoinColumn
    private Sport sport;

    @ManyToOne
    @PrimaryKeyJoinColumn
    private Address address;

    private Double latitude;

    private Double longitude;

    public Event(String title, String description, User owner, Sport sport, Address address, Double latitude, Double longitude) {
        this.title = title;
        this.description = description;
        this.owner = owner;
        this.sport = sport;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}