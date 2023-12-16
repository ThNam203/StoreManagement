package com.springboot.store.service.impl;

import com.springboot.store.entity.Location;
import com.springboot.store.entity.Staff;
import com.springboot.store.payload.LocationDTO;
import com.springboot.store.repository.LocationRepository;
import com.springboot.store.service.LocationService;
import com.springboot.store.service.StaffService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

// updated store
@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {
    private final LocationRepository locationRepository;
    private final ModelMapper modelMapper;
    private final StaffService staffService;

    @Override
    public LocationDTO getLocationById(int id) {
        Location location = locationRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Location not found with id: " + id));
        return modelMapper.map(location, LocationDTO.class);
    }

    @Override
    public List<LocationDTO> getAllLocations() {
        int storeId = staffService.getAuthorizedStaff().getStore().getId();
        List<Location> locations = locationRepository.findByStoreId(storeId);
        return locations.stream()
                .map(location -> modelMapper.map(location, LocationDTO.class))
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public LocationDTO createLocation(LocationDTO locationDTO) {
        Staff staff = staffService.getAuthorizedStaff();
        Location location = modelMapper.map(locationDTO, Location.class);
        if (locationRepository.findByNameAndStoreId(location.getName(), staff.getStore().getId()).isPresent()) {
            throw new EntityNotFoundException("Location already exists with name: " + location.getName());
        }
        location.setStore(staff.getStore());
        location = locationRepository.save(location);
        return modelMapper.map(location, LocationDTO.class);
    }

    @Override
    public LocationDTO updateLocation(int id, LocationDTO locationDTO) {
        Location existingLocation = locationRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Location not found with id: " + id));
        if (locationRepository.findByNameAndStoreId(locationDTO.getName(), existingLocation.getStore().getId()).isPresent()) {
            throw new EntityNotFoundException("Location already exists with name: " + locationDTO.getName());
        }
        existingLocation.setName(locationDTO.getName());
        existingLocation = locationRepository.save(existingLocation);
        return modelMapper.map(existingLocation, LocationDTO.class);
    }

    @Override
    public void deleteLocation(int id) {
        locationRepository.deleteById(id);
    }
}
