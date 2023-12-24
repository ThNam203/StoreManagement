package com.springboot.store.controller;

import com.springboot.store.payload.ViolationAndRewardDTO;
import com.springboot.store.service.ViolationAndRewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/violation-and-rewards")
public class ViolationAndRewardController {
    private final ViolationAndRewardService violationAndRewardService;

    @GetMapping
    public ResponseEntity<?> getAllViolationAndRewards() {
        return new ResponseEntity<>(violationAndRewardService.getAllViolationAndRewards(), null, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> createViolationAndReward(@RequestBody ViolationAndRewardDTO violationAndRewardDTO) {
        return new ResponseEntity<>(violationAndRewardService.createViolationAndReward(violationAndRewardDTO), null, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateViolationAndReward(@PathVariable int id, @RequestBody ViolationAndRewardDTO violationAndRewardDTO) {
        return new ResponseEntity<>(violationAndRewardService.updateViolationAndReward(id, violationAndRewardDTO), null, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteViolationAndReward(@PathVariable int id) {
        violationAndRewardService.deleteViolationAndReward(id);
        return new ResponseEntity<>(null, null, HttpStatus.OK);
    }

}
