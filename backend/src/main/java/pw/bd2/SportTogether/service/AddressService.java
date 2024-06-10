package pw.bd2.SportTogether.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pw.bd2.SportTogether.model.Address;
import pw.bd2.SportTogether.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import java.util.List;


@Service
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class AddressService {
    @Autowired
    private AddressRepository addressRepository;

    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

    public Optional<Address> getAddressById(Integer id) {
        return addressRepository.findById(id);
    }

    public Address saveAddress(Address address) {
        return addressRepository.save(address);
    }

    public void deleteAddress(Integer id) {
        addressRepository.deleteById(id);
    }
}
