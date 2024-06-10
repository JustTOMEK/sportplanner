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

    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name = "owner_id")
    @Column(nullable = false)
    private Integer owner_id;

    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name = "sport_id")
    @Column(nullable = false)
    private Integer sport_id;

    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name = "address_id")
    @Column(nullable = false)
    private Integer address_id;

    private Double latitude;

    private Double longitude;
}