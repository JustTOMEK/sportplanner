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

    private String country;

    private String city;

    private String street;

    private Integer building_number;

    private Integer flat_number;

    private String postal_code;

    public Address(String country, String city, String street, Integer building_number, Integer flat_number, String postal_code) {
        this.country = country;
        this.city = city;
        this.street = street;
        this.building_number = building_number;
        this.flat_number = flat_number;
        this.postal_code = postal_code;
    }
}