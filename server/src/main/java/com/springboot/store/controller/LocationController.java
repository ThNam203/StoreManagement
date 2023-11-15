package com.springboot.store.controller;

import com.springboot.store.payload.LocationDTO;
import com.springboot.store.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {
    private final LocationService locationService;

    @GetMapping("/{locationId}")
    public ResponseEntity<LocationDTO> getLocationById(@PathVariable int locationId) {
        LocationDTO locationDTO = locationService.getLocationById(locationId);
        return ResponseEntity.ok(locationDTO);
    }

    @GetMapping
    public ResponseEntity<List<LocationDTO>> getAllLocations() {
        List<LocationDTO> locations = locationService.getAllLocations();
        return ResponseEntity.ok(locations);
    }

    @PostMapping
    public ResponseEntity<LocationDTO> createLocation(@RequestBody LocationDTO locationDTO) {
        LocationDTO createdLocation = locationService.createLocation(locationDTO);
        return ResponseEntity.ok(createdLocation);
    }

    @PutMapping("/{locationId}")
    public ResponseEntity<LocationDTO> updateLocation(
            @PathVariable int locationId,
            @RequestBody LocationDTO locationDTO
    ) {
        LocationDTO updatedLocation = locationService.updateLocation(locationId, locationDTO);
        return ResponseEntity.ok(updatedLocation);
    }

    @DeleteMapping("/{locationId}")
    public ResponseEntity<Void> deleteLocation(@PathVariable int locationId) {
        locationService.deleteLocation(locationId);
        return ResponseEntity.noContent().build();
    }
}
