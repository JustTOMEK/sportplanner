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

    @Column(nullable = false, length = 50)
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
}