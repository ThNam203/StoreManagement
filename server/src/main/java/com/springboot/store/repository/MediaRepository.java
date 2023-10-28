package com.springboot.store.repository;

import com.springboot.store.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MediaRepository extends JpaRepository<Media, Integer> {
    Optional<Media> findByUrl(String url);
}
