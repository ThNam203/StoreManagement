package com.springboot.store.service;

import com.springboot.store.payload.LocationDTO;

import java.util.List;

public interface LocationService {
    LocationDTO getLocationById(int id);

    List<LocationDTO> getAllLocations();

    LocationDTO createLocation(LocationDTO locationDTO);

    LocationDTO updateLocation(int id, LocationDTO locationDTO);

    void deleteLocation(int id);
}
