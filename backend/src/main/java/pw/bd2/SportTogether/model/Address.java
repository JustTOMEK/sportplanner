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
@Table(name = "address")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 50)
    private String country;

    @Column(nullable = false, length = 50)
    private String city;

    @Column(length = 50)
    private String street;

    private Integer building_number;

    private Integer flat_number;

    @Column(length = 10)
    private String postal_code;

    @OneToOne(mappedBy = "address_id")
    private Event event;
}